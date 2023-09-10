import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CliCommandModule } from '@src/cli-command/cli-command.module';
import { configSchema, getConfig } from '@src/config/configuration';
import { LlmModule } from '@src/llm/llm.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: false,
      validationSchema: { validate: configSchema.parse },
      load: [getConfig],
    }),
    CliCommandModule,
    LlmModule,
  ],
})
export class AppModule {}
