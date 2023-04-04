import { fileToPrompts } from "./cache";
import { readFileSync } from "fs";
import type {
    Prompts,
    GeneratedPrompt
} from "@rompt/types";

interface GenerateSettings {
    promptFilePath: string;
    version: number | "latest";
}

type TemplateObject = Record<string, string>;

export function generate(
    promptName: string,
    templateObject: TemplateObject,
    options?: GenerateSettings
): GeneratedPrompt {
    const {
        promptFilePath = "prompts.json",
        version = "latest"
    } = options || {};
    
    if (!fileToPrompts[promptFilePath]) {
        const fsPromptFile = readFileSync(promptFilePath, "utf8");
        if (fsPromptFile) {
            fileToPrompts[promptFilePath] = JSON.parse(readFileSync(promptFilePath, "utf8"));
        } else {
            throw new Error(`Could not find prompts file at ${promptFilePath}. Please run \`npx rompt pull\`.`);
        }
    }

    const {
        branchId,
        id,
        versions
    } = fileToPrompts[promptFilePath][promptName];

    const {
        parts,
    } = versions[
        version === "latest" ?
            Math.max(...Object.keys(versions).map(ele => Number(ele)))
            :
            version
    ];


    return {
        prompt: generateString(parts, templateObject),
        metadata: {
            branchId,
            id,
        }
    }
        
}

type FlattenedItem = Prompts[keyof Prompts]["versions"][number]["parts"];

function generateString(
    items: FlattenedItem, 
    variables: TemplateObject
): string {
    let result = "";

    items.forEach((item) => {
        if (item.type === "text") {
            result += item.content;
        } else if (item.type === "variable") {
            const variableValue = variables[`{${item.content}}`];
            if (variableValue !== undefined) {
                result += variableValue;
            }
        } else if (item.type === "paragraph") {
            result += "\n";
        }
    });

    return result;
}
