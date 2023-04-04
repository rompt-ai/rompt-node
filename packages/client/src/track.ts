import { ephemeralDotenv } from "@rompt/common";
import { GeneratedPrompt } from "@rompt/types";
import Queue from 'better-queue';
import fetch from "cross-fetch";

const apiToken = process.env['ROMPT_API_TOKEN'] || ephemeralDotenv()["ROMPT_API_TOKEN"];

const sendTrackArr = (generatedPromptsArr: readonly GeneratedPrompt[]) => fetch("https://rompt.dev/api/track", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        apiToken,
        tracks: generatedPromptsArr
    }),
});

const queue = new Queue(function (batch, cb) {
    sendTrackArr(batch).then(cb)
}, {
    batchSize: 3,
    batchDelay: 3000,
});


interface TrackOptions {
    disableBatching?: boolean;
}

export async function track(generatedPrompt: GeneratedPrompt, options?: TrackOptions) {
    const {
        disableBatching = false
    } = options || {};

    if (disableBatching) {
        return sendTrackArr([generatedPrompt]);
    } else {
        queue.push(generatedPrompt);
        return;
    }
}
