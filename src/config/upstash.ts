import { Client as WorkflowClient } from '@upstash/workflow';
import { env } from './env';

export const workflowClient = new WorkflowClient({
    baseUrl: env.QSTASH_URL,
    token: env.QSTASH_TOKEN,
})
