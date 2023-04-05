import { getApiToken } from '@romptai/common';
import { GeneratedPrompt, GeneratedPromptWithResponse } from '@romptai/types';
import Queue from 'better-queue';
import fetch from 'cross-fetch';
import { isAwsLambdaEnv } from './cache';
import type { CreateChatCompletionResponse, CreateCompletionResponse } from 'openai';

const sendTrackArr = (
    generatedPromptsWithResponseArr: readonly GeneratedPromptWithResponse[],
    apiToken: string,
    _env?: string
) =>
    fetch(_env ? `https://api-${_env}.aws.rompt.ai/track` : 'https://api.aws.rompt.ai/track', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            apiToken,
            tracks: generatedPromptsWithResponseArr,
        }),
    });

const queue = new Queue(
    function (batch, cb) {
        // batch is an array of at most 3 items
        // [{ generatedPrompt: GeneratedPrompt, options?: TrackOptions }, {...}, {...}}]
        const { 
            options,
        } = batch[0];
        sendTrackArr(
            batch.map((ele: any) => ele.generatedPromptWithResponse), 
            options.apiToken || getApiToken(), 
            options._env
        ).then(cb);
    },
    {
        batchSize: 3,
        batchDelay: 3000,
    },
);

interface TrackOptions {
    enableBatching?: boolean;
    apiToken?: string;
}

export async function track(
    generatedPrompt: GeneratedPrompt, 
    response?: CreateChatCompletionResponse | CreateCompletionResponse, 
    options: TrackOptions = {}
) {
    const generatedPromptWithResponse: GeneratedPromptWithResponse = {
        ...generatedPrompt,
        response,
    };

    if (options.enableBatching && !isAwsLambdaEnv()) {
        return sendTrackArr([generatedPromptWithResponse], options.apiToken || getApiToken(), (options as any)._env);
    } else {
        queue.push({ generatedPromptWithResponse, options, });
        return;
    }
}
