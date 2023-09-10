import { Module } from '@nestjs/common';
import { LlmController } from '@src/llm/controllers/llm.controller';
import { LlmService } from '@src/llm/service/llm.service';

@Module({
  imports: [],
  controllers: [LlmController],
  providers: [LlmService],
})
export class LlmModule {}
