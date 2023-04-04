import { getApiToken, debugLog } from '@rompt/common';
import type { Prompts } from '@rompt/types';
import { writeFileSync } from 'fs';
import { join } from 'path';
import fetch from 'cross-fetch';

interface Pull {
    'branch'?: string;
    'destination'?: string;
    '_env'?: string;
    '_dry'?: boolean;
}

export async function pull({
    branch,
    destination = 'prompts.json',
    _env = 'prod',
    _dry = false
}: Pull): Promise<Prompts> {
    const rootApi = _env ? `api-${_env}.aws.rompt.ai` : 'api.aws.rompt.ai';
    debugLog(_env, "CWD ", process.cwd())

    const apiToken = getApiToken();

    debugLog(_env,
        `Pulling prompts from branch ${branch}.`,
        JSON.stringify({
            branch,
            destination,
            env: _env,
            apiToken,
            rootApi,
            cwd: process.cwd()
        }, null, 2)
    );

    const pullResult = await fetch(`https://${rootApi}/pull`, {
        method: 'POST',
        body: JSON.stringify({
            apiToken,
            branch,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    }).then((res) => res.json() as Promise<Prompts>);
    debugLog(_env, `Pull result: ${JSON.stringify(pullResult, null, 2)}`);

    if (!_dry) {
        writeFileSync(join(process.cwd(), destination), JSON.stringify(pullResult, null, 2));
    }

    console.log(
        `Done! Your prompts are in ${destination}.` +
        `\n\nNext, install the \`@rompt/client\` package then use it in your code like this:` +
        `\n\n\nconst romptData = generate("your-prompt-name", {\n  NAME: "Michael",\n  DIRECTION: "Generate a Tweet",\n  SENTIMENT: \`Make the Tweet about \$\{myOtherVariable\}\`\n})` +
        `\n\nconst { prompt } = romptData;` +
        `\n\n// Your generated prompt is in \`prompt\`` +
        `\n\n// Example with OpenAI:` +
        `\n\nconst gptResponse = await openai.createCompletion({\n  prompt,\n  //...\n});`,
    );
    
    return pullResult;
}
