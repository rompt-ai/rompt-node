import { expect } from 'expect';
import { pull } from '@romptai/cli/src/index';
import { generate, track } from '@romptai/client';
import { 
    Configuration as OpenAIConfiguration,
    OpenAIApi,
} from 'openai';
import dotenv from 'dotenv';
dotenv.config();

// A .env file is required in the root of the project
describe('Rompt Test', () => {
    it('CLI Pull without branch', async () => {
        const arr = await pull({
            _env: 'staging',
            _dry: false,
        });
        expect(arr['_errors']).toBeFalsy();
    });

    it('CLI Pull with branch', async () => {
        const arr = await pull({
            _env: 'staging',
            _dry: false,
            branch: 'main',
        });
        expect(arr['_errors']).toBeFalsy();
    });


    it('Generate Prompt With No Input', async () => {
        await pull({
            _env: 'staging',
            _dry: true,
        });

        const result = generate('test', {});
        expect(result.prompt).toBe('This prompt is for testing the client packages. The current package is ');
    });

    it('Generate Prompt With Input', async () => {
        await pull({
            _env: 'staging',
            _dry: true,
        });

        const result = generate('test', {
            "{LANG}": "TypeScript"
        });
        expect(result.prompt).toBe('This prompt is for testing the client packages. The current package is TypeScript');
    });

    it('Track Prompt Without Response', async () => {
        await pull({
            _env: 'staging',
            _dry: true,
        });

        const result = generate('test', {
            "LANG": "TypeScript"
        });
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
            _dry: true,
        });

        const result = generate('test', {
            "LANG": "TypeScript"
        });

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
            _dry: true,
        });

        const result = generate('test', {
            "LANG": "TypeScript"
        });

        const openaiConfig = new OpenAIConfiguration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(openaiConfig);
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
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