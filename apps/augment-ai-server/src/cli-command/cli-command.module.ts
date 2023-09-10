import { Module } from '@nestjs/common';
import { ExampleCommand } from '@src/cli-command/example.cmd';

@Module({
  imports: [],
  providers: [ExampleCommand],
})
export class CliCommandModule {}
