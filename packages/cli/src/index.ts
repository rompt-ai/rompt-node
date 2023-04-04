#! /usr/bin/env node

import arg from 'arg';
import fetch from 'cross-fetch';
import * as dotenv from 'dotenv';
import type { Prompts } from './types';
import { writeFileSync } from 'fs';
import { join } from 'path';

const args = arg({
    '--branch': String,
    '--destination': String,
    '--_env': String,

    '-b': '--branch',
    '-d': '--destination',
});

async function main() {
    const env = args['--_env'] || 'prod';
    const rootApi = env ? `api-${env}.aws.rompt.ai` : "api.aws.rompt.ai";

    let apiToken: string;
    if (process.env['ROMPT_API_TOKEN']) {
        apiToken = process.env['ROMPT_API_TOKEN'];
    } else {
        dotenv.config();
        if (process.env['ROMPT_API_TOKEN']) {
            apiToken = process.env['ROMPT_API_TOKEN'];
        } else {
            throw new Error('ROMPT_API_TOKEN not found');
        }
    }

    const pullResult = await fetch(`https://${rootApi}/pull`, {
        method: "POST",
        body: JSON.stringify({
            apiToken,
            branch: args['--branch'],
        }),
        headers: {
            'Content-Type': 'application/json',
        }
    }).then((res) => res.json() as Promise<Prompts>);

    const destination = args['--destination'] || 'prompts.json';

    writeFileSync(join(process.cwd(), destination), JSON.stringify(pullResult, null, 2));
    
    console.log(
        `Done! Your prompts are in ${destination}.` + 
        `\n\nNext, install the \`@rompt/client\` package then use it in your code like this:` +
        `\n\n\nconst romptData = generate("your-prompt-name", {\n  NAME: "Michael",\n  DIRECTION: "Generate a Tweet",\n  SENTIMENT: \`Make the Tweet about \$\{myOtherVariable\}\`\n})` +
        `\n\nconst { prompt } = romptData;` +
        `\n\n// Your generated prompt is in \`prompt\`` +
        `\n\n// Example with OpenAI:` +
        `\n\nconst gptResponse = await openai.createCompletion({\n  prompt,\n  //...\n});`
    );
}

main()
    .then(() => {
        process.exit(0);
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    })