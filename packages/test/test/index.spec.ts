import { expect } from 'expect';
import { pull } from '@romptai/cli/src/index';
import { generate, track } from '@romptai/client';
import { 
    Configuration as OpenAIConfiguration,
    OpenAIApi,
    CreateChatCompletionRequest
} from 'openai';

// A .env file is required in the root of the project
describe('Rompt Testt', () => {
    it('CLI Pull', async () => {
        const arr = await pull({
            _env: 'staging',
        });
        expect(Object.keys(arr).length).toBeGreaterThan(0);
    });

    it('Generate Prompt', async () => {
        await pull({
            _env: 'staging',
        });

        const result = generate('test', {});
        expect(typeof result.prompt).toBe('string');
    });

    it('Track Prompt Without Response', async () => {
        await pull({
            _env: 'staging',
        });

        const result = generate('test', {});
        const trackResponse = await track(result, undefined, { _env: 'staging' } as any);

        if (trackResponse) {
            const { success } = await trackResponse.json();
            expect(success).toBe(true);
        } else {
            throw new Error('No track response');
        }
    });

    it('Track Prompt With Chat Completion Response', async () => {
        await pull({
            _env: 'staging',
        });

        const result = generate('test', {});

        const openaiConfig = new OpenAIConfiguration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(openaiConfig);
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: result.prompt
                }
            ]
        });
        const trackResponse = await track(result, completion.data, { _env: 'staging' } as any);

        if (trackResponse) {
            const { success } = await trackResponse.json();
            expect(success).toBe(true);
        } else {
            throw new Error('No track response');
        }
    });

    it('Track Prompt With Completion Response', async () => {
        await pull({
            _env: 'staging',
        });

        const result = generate('test', {});

        const openaiConfig = new OpenAIConfiguration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(openaiConfig);
        const completion = await openai.createCompletion({
            model: "gpt-3.5-turbo",
            prompt: result.prompt
        });
        const trackResponse = await track(result, completion.data, { _env: 'staging' } as any);

        if (trackResponse) {
            const { success } = await trackResponse.json();
            expect(success).toBe(true);
        } else {
            throw new Error('No track response');
        }
    });
})