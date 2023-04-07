import { fileToPrompts } from './cache';
import { readFileSync } from 'fs';
import type { Prompts, GeneratedPrompt, TemplateObject } from '@romptai/types';

interface GenerateSettings {
    promptFilePath: string;
    version: number | 'latest';
}

export function generate(promptName: string, templateObject?: TemplateObject, options?: GenerateSettings): GeneratedPrompt {
    const { promptFilePath = 'prompts.json', version = 'latest' } = options || {};
    const formattedTemplateObject = formatVariableKeysWithCurlies(templateObject);

    if (!fileToPrompts[promptFilePath]) {
        const fsPromptFile = readFileSync(promptFilePath, 'utf8');
        if (fsPromptFile) {
            fileToPrompts[promptFilePath] = JSON.parse(readFileSync(promptFilePath, 'utf8'));
        } else {
            throw new Error(`Could not find prompts file at ${promptFilePath}. Please run \`npx rompt pull\`.`);
        }
    }

    const { branchId, id: promptId, versions } = fileToPrompts[promptFilePath][promptName];

    const versionNumber = version === 'latest' ? Math.max(...Object.keys(versions).map((ele) => Number(ele))) : version;
    const { parts } = versions[versionNumber];

    return {
        prompt: generateString(parts, formattedTemplateObject),
        metadata: {
            branchId,
            promptId,
            version: versionNumber,
            template: formattedTemplateObject,
        },
    };
}

function formatVariableKeysWithCurlies(templateObject?: TemplateObject): TemplateObject {
    const formattedOutput: TemplateObject = {};

    if (!templateObject) {
        return formattedOutput;
    }

    Object.keys(templateObject).forEach(key => {
        let formattedKey = key;

        if (!formattedKey.startsWith("{")) {
            formattedKey = "{" + formattedKey;
        }

        if (!formattedKey.endsWith("}")) {
            formattedKey = formattedKey + "}";
        }

        formattedOutput[formattedKey] = templateObject[key];
    });

    return formattedOutput;
}


type FlattenedItem = Prompts[keyof Prompts]['versions'][number]['parts'];

function generateString(items: FlattenedItem, variables: TemplateObject): string {
    let result = '';

    items.forEach((item) => {
        if (item.type === 'text') {
            result += item.content;
        } else if (item.type === 'variable') {
            const variableValue = variables[item.content];
            if (variableValue !== undefined) {
                result += variableValue;
            }
        } else if (item.type === 'paragraph') {
            result += '\n';
        }
    });

    return result;
}
