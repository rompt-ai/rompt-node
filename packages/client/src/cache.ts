import type { Prompts } from '@rompt/types';

export const fileToPrompts: Record<string, Prompts> = {};

export function isAwsEnv() {
    return process.env['AWS_LAMBDA_FUNCTION_NAME'] || process.env['AWS_LAMBDA_FUNCTION_VERSION'];
}
