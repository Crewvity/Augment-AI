import { Body, Controller, Post } from '@nestjs/common';
import { LlmChatRequestDto } from '@src/llm/dto/llm-chat-request.dto';
import { LlmInitialiseRequestDto } from '@src/llm/dto/llm-initialise.dto';
import { LlmService } from '@src/llm/service/llm.service';

@Controller('llm')
export class LlmController {
  constructor(private readonly llmService: LlmService) {}

  @Post('initialise-model')
  async initialise(@Body() { documentsFolderPath }: LlmInitialiseRequestDto) {
    return await this.llmService.initialise(documentsFolderPath);
  }

  @Post('chat')
  async chat(@Body() { message }: LlmChatRequestDto) {
    const output = await this.llmService.chat(message);
    return { output };
  }

  @Post('reset-chat')
  async resetChat() {
    await this.llmService.resetChat();
  }
}
