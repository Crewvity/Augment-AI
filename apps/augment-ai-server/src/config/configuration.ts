import * as dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

export const databaseConfigSchema = z.object({
  DB_PORT: z.coerce.number().int().positive().default(5432),
  DB_HOST: z.string(),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string().default('postgres'),
});

export const configSchema = z
  .object({
    NODE_ENV: z.string().nonempty(),
    PORT: z.string().refine((value) => !isNaN(parseInt(value)), {
      message: 'PORT should be a number',
    }),
    OPENAI_API_KEY: z.string().nonempty(),
  })
  .merge(databaseConfigSchema);

export type Config = z.infer<typeof configSchema>;

export const getConfig = () => configSchema.parse(process.env);
