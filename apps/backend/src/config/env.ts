import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    JSEARCH_API_KEY: z.string(),
    EXTRACTOR_URL: z.string().url(),
    LOG_LEVEL: z.string().optional().default('info'),
});

export const env = envSchema.parse(process.env);
