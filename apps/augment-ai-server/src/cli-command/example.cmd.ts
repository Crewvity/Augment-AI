import { Logger } from '@nestjs/common';
import { Command, CommandRunner, Option } from 'nest-commander';

interface BasicCommandOptions {
  string?: string;
  boolean?: boolean;
  number?: number;
}

@Command({ name: 'example', description: 'An example command with cli args' })
export class ExampleCommand extends CommandRunner {
  private readonly logger = new Logger(ExampleCommand.name);

  async run(
    passedParam: string[],
    options?: BasicCommandOptions,
  ): Promise<void> {
    if (options?.boolean !== undefined && options?.boolean !== null) {
      this.runWithBoolean(passedParam, options.boolean);
    } else if (options?.number) {
      this.runWithNumber(passedParam, options.number);
    } else if (options?.string) {
      this.runWithString(passedParam, options.string);
    } else {
      this.runWithNone(passedParam);
    }
  }

  @Option({
    flags: '-n, --number [number]',
    description: 'A basic number parser',
  })
  parseNumber(val: string): number {
    return Number(val);
  }

  @Option({
    flags: '-s, --string [string]',
    description: 'A string return',
  })
  parseString(val: string): string {
    return val;
  }

  @Option({
    flags: '-b, --boolean [boolean]',
    description: 'A boolean parser',
  })
  parseBoolean(val: string): boolean {
    return JSON.parse(val);
  }

  runWithString(param: string[], option: string): void {
    this.logger.log({ param, string: option });
  }

  runWithNumber(param: string[], option: number): void {
    this.logger.log({ param, number: option });
  }

  runWithBoolean(param: string[], option: boolean): void {
    this.logger.log({ param, boolean: option });
  }

  runWithNone(param: string[]): void {
    this.logger.log({ param });
  }
}
