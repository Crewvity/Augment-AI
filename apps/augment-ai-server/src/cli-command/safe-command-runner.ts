import { CommandRunner } from 'nest-commander';

// The default CommandRunner does not catch uncaught errors at all.
// This class makes sure the uncaught errors are at least caught and logged.
export abstract class SafeCommandRunner extends CommandRunner {
  async run(positionalArgs: unknown, optionalArgs?: unknown): Promise<void> {
    try {
      await this.safeRun(positionalArgs, optionalArgs);
    } catch (error) {
      console.error(error);
    }
  }

  protected abstract safeRun(
    positionalArgs: unknown,
    optionalArgs?: unknown,
  ): Promise<void>;
}
