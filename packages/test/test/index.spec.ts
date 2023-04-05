import { expect } from 'expect';
import { pull } from 'rompt/src/index';
import { generate, track } from '@rompt/client';

// A .env file is required in the root of the project
describe('CLI pull', () => {
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

    it('Track Prompt', async () => {
        await pull({
            _env: 'staging',
        });

        const result = generate('test', {});
        const trackResponse = await track(result, { _env: 'staging' } as any);

        if (trackResponse) {
            const { success } = await trackResponse.json();
            expect(success).toBe(true);
        } else {
            throw new Error('No track response');
        }
    });
})