import { LogLevel } from '@nestjs/common';
import { AppModule } from '@src/app.module';
import { CommandFactory } from 'nest-commander';

async function bootstrap() {
  const logLevels = (process.env.LOG_LEVELS?.split(',') || [
    'debug',
    'log',
    'warn',
    'error',
  ]) as LogLevel[];

  await CommandFactory.run(AppModule, {
    logger: logLevels,
  });
}

void bootstrap();
