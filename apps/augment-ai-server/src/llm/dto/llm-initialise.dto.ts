import { IsNotEmpty, IsString } from 'class-validator';

export class LlmInitialiseDto {
  @IsNotEmpty()
  @IsString()
  documentsFolderPath!: string;
}
