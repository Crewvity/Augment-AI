import { Body, Controller, Post } from '@nestjs/common';
import { LlmInitialiseDto } from '@src/llm/dto/llm-initialise.dto';
import { LlmService } from '@src/llm/service/llm.service';
import { Message as VercelChatMessage } from 'ai';

@Controller('llm')
export class LlmController {
  constructor(private readonly llmService: LlmService) {}

  @Post('initialise-model')
  async initialise(@Body() { documentsFolderPath }: LlmInitialiseDto) {
    return await this.llmService.initialise(documentsFolderPath);
  }

  @Post('chat')
  async chat(@Body() { messages }: { messages: VercelChatMessage[] }) {
    console.log('&&& chat :: messages: ', messages);
    const output = await this.llmService.chat(messages);
    return { output };
  }
}
