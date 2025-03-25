import 'dotenv/config'
import { z } from 'zod';

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    DATABASE_URL: z.string(),
    PORT: z.coerce.number().default(3333),
    SERVER_URL: z.string(),
    JWT_SECRET: z.string(),
    JWT_EXPIRES_IN: z.string(),
    ARCJET_KEY: z.string(),
    ARCJET_ENV: z.string(),
    QSTASH_URL: z.string(),
    QSTASH_TOKEN: z.string(),
    QSTASH_CURRENT_SIGNING_KEY: z.string(),
    QSTASH_NEXT_SIGNING_KEY: z.string(),
    EMAIL_PASSWORD: z.string(),
    EMAIL_ACCOUNT: z.string().email(),
})

const _env = envSchema.safeParse(process.env)

if(!_env.success) {
    console.error('❌ Invalid environment variables', _env.error.format())
    throw new Error('Invalid environment variables')
}

export const env = _env.data