import type { CreateChatCompletionResponse, CreateCompletionResponse } from 'openai';

type FlattenedItem = { type: 'text'; content: string } | { type: 'variable'; content: string; description: string } | { type: 'paragraph' };

export type Prompts = Record<
    string,
    {
        id: string;
        branchId: string;
        versions: Record<
            number,
            {
                text: string;
                parts: FlattenedItem[];
            }
        >;
    }
>;

export type TemplateObject = Record<string, string>;

export type GeneratedPrompt = {
    prompt: string;
    metadata: {
        branchId: string;
        promptId: string;
        version: number;
        template: TemplateObject;
    };
};

export type GeneratedPromptWithResponse = GeneratedPrompt & {
    response?: CreateChatCompletionResponse | CreateCompletionResponse;
};