import { IsNotEmpty, IsString } from 'class-validator';

export class LlmInitialiseRequestDto {
  @IsNotEmpty()
  @IsString()
  documentsFolderPath!: string;
}
