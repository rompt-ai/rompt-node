import type { Prompts } from '@romptai/types';
interface Pull {
    'branch'?: string;
    'destination'?: string;
    'apiToken'?: string;
    '_env'?: string;
    '_dry'?: boolean;
}
export declare function pull({ branch, destination, apiToken, _env, _dry }: Pull): Promise<Prompts>;
export {};
//# sourceMappingURL=index.d.ts.map