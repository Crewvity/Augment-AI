import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from '@src/config/configuration';
import { Message as VercelChatMessage } from 'ai';
import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import {
  OpenAIAgentTokenBufferMemory,
  createRetrieverTool,
} from 'langchain/agents/toolkits';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { Document } from 'langchain/document';
import { CSVLoader } from 'langchain/document_loaders/fs/csv';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import {
  JSONLinesLoader,
  JSONLoader,
} from 'langchain/document_loaders/fs/json';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { ChatMessageHistory } from 'langchain/memory';
import { MultiVectorRetriever } from 'langchain/retrievers/multi_vector';
import { AIMessage, ChatMessage, HumanMessage } from 'langchain/schema';
import { InMemoryStore } from 'langchain/storage/in_memory';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Calculator } from 'langchain/tools/calculator';
import { TypeORMVectorStore } from 'langchain/vectorstores/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as uuid from 'uuid';

const CUSTOM_INSTRUCTIONS = `
- You are a quantitative analyst who designs trading strategies based on technical analysis.
- You are also a programmer who writes code to implement these strategies.
- You know clearly what the pros and cons of technical analysis are and know when not to use them.
- Write code with following requirements:
  - Use Typescript, strict mode
  - "any" type is not allowed
  - "as" type casting is not allowed
  - "!" is only allowed for non-null assertion
  - strictNullChecks is enabled
  - noImplicitAny is enabled
  - Use functional programming style whenever possible
- All your code examples should be in Typescript
`;

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);

  private retriever: MultiVectorRetriever | undefined;

  constructor(private readonly config: ConfigService<Config>) {}

  async initialise(documentsFolderPath: string) {
    this.logger.log(
      `Initialising LLM with documents in ${documentsFolderPath}`,
    );
    await this.resetDB();
    const parentDocs = await this.loadDocumentsInFolder(documentsFolderPath);
    this.retriever = await this.getRetriever(parentDocs);
    this.logger.log(`Initialised LLM and retriever ready`);
  }

  async chat(chatMessages: VercelChatMessage[]): Promise<string> {
    if (!this.retriever) {
      throw new Error('Retriever not initialised');
    }

    console.log('chatMessage: ', chatMessages);

    /**
     * We represent intermediate steps as system messages for display purposes,
     * but don't want them in the chat history.
     */
    const messages = (chatMessages ?? []).filter(
      (message: VercelChatMessage) =>
        message.role === 'user' || message.role === 'assistant',
    );

    const previousMessages = messages.slice(0, -1);
    const currentMessageContent = messages[messages.length - 1].content;

    const model = new ChatOpenAI({
      modelName: 'gpt-4',
      openAIApiKey: this.config.getOrThrow('OPENAI_API_KEY'),
    });

    const chatHistory = new ChatMessageHistory(
      previousMessages.map(this.convertVercelMessageToLangChainMessage),
    );

    /**
     * This is a special type of memory specifically for conversational
     * retrieval agents.
     * It tracks intermediate steps as well as chat history up to a
     * certain number of tokens.
     *
     * The default OpenAI Functions agent prompt has a placeholder named
     * "chat_history" where history messages get injected - this is why
     * we set "memoryKey" to "chat_history". This will be made clearer
     * in a future release.
     */
    const memory = new OpenAIAgentTokenBufferMemory({
      llm: model,
      memoryKey: 'chat_history',
      outputKey: 'output',
      chatHistory,
    });

    /**
     * Wrap the retriever in a tool to present it to the agent in a
     * usable form.
     */
    const taBooksTool = createRetrieverTool(this.retriever, {
      name: 'technical-analysis-books',
      description:
        'Technical Analysis Books - useful for when you need to ask questions about technical analysis and how to code it',
    });

    const tools = [new Calculator(), taBooksTool];

    const executor = await initializeAgentExecutorWithOptions(tools, model, {
      agentType: 'openai-functions',
      memory,
      returnIntermediateSteps: true,
      verbose: true,
      agentArgs: {
        prefix: CUSTOM_INSTRUCTIONS,
      },
    });

    const result = await executor.call({
      input: currentMessageContent,
    });

    return result.output;
  }

  private async resetDB() {
    this.logger.log(`Resetting DB`);
    const dataSource = new DataSource({
      type: 'postgres',
      database: this.config.getOrThrow('DB_DATABASE'),
      username: this.config.getOrThrow('DB_USERNAME'),
      password: this.config.getOrThrow('DB_PASSWORD'),
      host: this.config.getOrThrow('DB_HOST'),
      port: this.config.getOrThrow('DB_PORT'),
    });

    await dataSource.initialize();
    const connection = dataSource.createEntityManager().connection;
    await connection.dropDatabase();
    this.logger.log(`DB is reset`);
  }

  private async loadDocumentsInFolder(folderAbsolutePath: string) {
    this.logger.log(`Loading the documents from the folder`);
    const loader = new DirectoryLoader(folderAbsolutePath, {
      '.json': (path) => new JSONLoader(path, '/texts'),
      '.jsonl': (path) => new JSONLinesLoader(path, '/html'),
      '.txt': (path) => new TextLoader(path),
      '.csv': (path) => new CSVLoader(path, 'text'),
      '.pdf': (path) => new PDFLoader(path),
    });
    const result = await loader.load();
    this.logger.log(`Loaded the documents from the folder`);
    return result;
  }

  private async getRetriever(parentDocs: Document<Record<string, any>>[]) {
    this.logger.log(`Splitting the parent documents`);
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 10000,
      chunkOverlap: 20,
    });

    const splitParentDocs = await splitter.splitDocuments(parentDocs);

    const parentDocIdKey = 'doc_id';
    const parentDocIds = splitParentDocs.map((_) => uuid.v4());

    const childSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 400,
      chunkOverlap: 0,
    });

    this.logger.log(`Splitting the child documents`);
    const subDocs: Document<Record<string, any>>[] = [];
    for (let i = 0; i < splitParentDocs.length; i += 1) {
      const childDocs = await childSplitter.splitDocuments([
        splitParentDocs[i],
      ]);
      const taggedChildDocs = childDocs.map((childDoc) => {
        // eslint-disable-next-line no-param-reassign
        childDoc.metadata[parentDocIdKey] = parentDocIds[i];
        return childDoc;
      });
      subDocs.push(...taggedChildDocs);
    }

    const parentDocsMap: [string, Document<Record<string, any>>][] =
      splitParentDocs.map((doc, i) => [parentDocIds[i], doc]);

    const parentDocsStore = new InMemoryStore();
    await parentDocsStore.mset(parentDocsMap);

    const dbArgs = {
      postgresConnectionOptions: {
        type: 'postgres',
        host: this.config.getOrThrow('DB_HOST'),
        port: this.config.getOrThrow('DB_PORT'),
        username: this.config.getOrThrow('DB_USERNAME'),
        password: this.config.getOrThrow('DB_PASSWORD'),
        database: this.config.getOrThrow('DB_DATABASE'),
      } as DataSourceOptions,
    };

    this.logger.log(`TypeORM vector store being initialised`);
    const typeormVectorStore = await TypeORMVectorStore.fromDocuments(
      subDocs,
      new OpenAIEmbeddings(),
      dbArgs,
    );

    const retriever = new MultiVectorRetriever({
      vectorstore: typeormVectorStore,
      docstore: parentDocsStore,
      idKey: parentDocIdKey,
      // Optional `k` parameter to search for more child documents in VectorStore.
      // Note that this does not exactly correspond to the number of final (parent) documents
      // retrieved, as multiple child documents can point to the same parent.
      childK: 20,
      // Optional `k` parameter to limit number of final, parent documents returned from this
      // retriever and sent to LLM. This is an upper-bound, and the final count may be lower than this.
      parentK: 5,
    });

    this.logger.log(`Retriever is initialised`);

    return retriever;
  }

  private convertVercelMessageToLangChainMessage = (
    message: VercelChatMessage,
  ) => {
    if (message.role === 'user') {
      return new HumanMessage(message.content);
    } else if (message.role === 'assistant') {
      return new AIMessage(message.content);
    } else {
      return new ChatMessage(message.content, message.role);
    }
  };
}
