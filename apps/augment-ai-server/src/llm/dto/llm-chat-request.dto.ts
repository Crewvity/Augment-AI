import { Message } from 'ai';
import { IsNotEmpty } from 'class-validator';

export class LlmChatRequestDto {
  @IsNotEmpty()
  message!: Message;
}
