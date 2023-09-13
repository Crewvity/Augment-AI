import { ChatWindow } from "@/components/ChatWindow";

export default function Home() {
  const InfoCard = (
    <div className="p-4 md:p-8 rounded bg-[#25252d] w-full max-h-[85%] overflow-hidden">
      <h1 className="text-3xl md:text-4xl mb-4">Augment Your AI 🤖 + 📚</h1>
      <ul>
        <li className="text-l">
          🚀
          <span className="ml-2">
            Augment the OpenAI&apos;s GPT-4 model with your own documents to
            educate it the way you want.
          </span>
        </li>
        <li className="text-l">
          📝
          <span className="ml-2">
            Add custom instructions for your AI to behave and respond in a
            customised way.
          </span>
        </li>
        <li className="text-l">
          📈
          <span className="ml-2">
            By default, the AI pretends to be a trading algorithm designer &
            coder.
          </span>
        </li>
        <li className="text-l">
          🏠
          <span className="ml-2">
            Host and run your vector database and the backend AI on your local
            machine for zero cost.
          </span>
        </li>
        <li className="text-l">
          🤲
          <span className="ml-2">
            This codebase is open source. Any contributions to make this better
            is welcomed.
          </span>
        </li>
        <li className="text-l">
          📖
          <span className="ml-2">
            Before running this app, you&apos;ll first need to set up the
            backend server properly. See the README for more details.
          </span>
        </li>
      </ul>
    </div>
  );

  return (
    <ChatWindow
      emptyStateComponent={InfoCard}
      placeholder={"Send a message"}
      emoji="🤖"
      titleText="Your Augmented AI"
    ></ChatWindow>
  );
}
