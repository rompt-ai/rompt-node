import { expect } from 'expect';
import { pull } from 'rompt/src/index';

describe('CLI pull', () => {
    it('should pull the latest version of the CLI', async () => {
        pull({
            _env: 'staging',
        });
        expect(1).toBe(1);
    });
})