import { ephemeralDotenv } from '@rompt/common';
import { GeneratedPrompt } from '@rompt/types';
import Queue from 'better-queue';
import fetch from 'cross-fetch';

const apiToken = process.env['ROMPT_API_TOKEN'] || ephemeralDotenv()['ROMPT_API_TOKEN'];

const sendTrackArr = (generatedPromptsArr: readonly GeneratedPrompt[], _env?: string) =>
    fetch(_env ? `https://api-${_env}.aws.rompt.ai/track` : 'https://api.aws.rompt.ai/track', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            apiToken,
            tracks: generatedPromptsArr,
        }),
    });

const queue = new Queue(
    function (batch, cb) {
        // batch is an array of at most 3 items
        // [{ generatedPrompt: GeneratedPrompt, options?: TrackOptions }, {...}, {...}}]

        const { generatedPrompt, options = {} } = batch;

        sendTrackArr(generatedPrompt, options._env).then(cb);
    },
    {
        batchSize: 3,
        batchDelay: 3000,
    },
);

interface TrackOptions {
    disableBatching?: boolean;
}

export async function track(generatedPrompt: GeneratedPrompt, options?: TrackOptions) {
    const { disableBatching = false } = options || {};

    if (disableBatching) {
        return sendTrackArr([generatedPrompt], (options || ({} as any))._env);
    } else {
        queue.push({ generatedPrompt, options });
        return;
    }
}
