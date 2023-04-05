import type { Prompts } from '@romptai/types';

export const fileToPrompts: Record<string, Prompts> = {};

export function isAwsLambdaEnv() {
    return process.env['AWS_LAMBDA_FUNCTION_NAME'] || process.env['AWS_LAMBDA_FUNCTION_VERSION'];
}
