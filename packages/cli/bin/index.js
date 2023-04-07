"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pull = void 0;
const common_1 = require("@romptai/common");
const fs_1 = require("fs");
const path_1 = require("path");
const cross_fetch_1 = __importDefault(require("cross-fetch"));
async function pull({ branch, destination = 'prompts.json', apiToken, _env = 'prod', _dry = false }) {
    const rootApi = _env ? `api-${_env}.aws.rompt.ai` : 'api.aws.rompt.ai';
    const _apiToken = apiToken || (0, common_1.getApiToken)();
    (0, common_1.debugLog)(_env, `Pulling prompts from branch ${branch}.`, JSON.stringify({
        branch,
        destination,
        env: _env,
        apiToken: _apiToken,
        rootApi,
        cwd: process.cwd()
    }, null, 2));
    const pullResult = await (0, cross_fetch_1.default)(`https://${rootApi}/pull`, {
        method: 'POST',
        body: JSON.stringify({
            apiToken: _apiToken,
            branch,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    }).then((res) => res.json());
    if (!_dry) {
        (0, fs_1.writeFileSync)((0, path_1.join)(process.cwd(), destination), JSON.stringify(pullResult, null, 2));
        console.log(`Done! Your prompts are in ${destination}.` +
            `\n\nNext, install the \`@romptai/client\` package then use it in your code like this:` +
            `\n\n\nconst romptData = generate("your-prompt-name", {\n  NAME: "Michael",\n  DIRECTION: "Generate a Tweet",\n  SENTIMENT: \`Make the Tweet about \$\{myOtherVariable\}\`\n})` +
            `\n\nconst { prompt } = romptData;` +
            `\n\n// Your generated prompt is in \`prompt\`` +
            `\n\n// Example with OpenAI:` +
            `\n\nconst gptResponse = await openai.createCompletion({\n  prompt,\n  //...\n});`);
    }
    return pullResult;
}
exports.pull = pull;
//# sourceMappingURL=index.js.map