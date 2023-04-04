import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

let _env: Record<string, string> | undefined;

function ephemeralDotenv() {
    if (!_env) {
        const envFilePath = resolve(process.cwd(), '.env');
        _env = {};
        if (existsSync(envFilePath)) {

            const content = readFileSync(envFilePath, 'utf-8');
            const lines = content.split('\n');
    
            lines.forEach((line) => {
                const [key, value] = line.split('=');
                if (key && value) {
                    _env![key.trim()] = value.trim();
                }
            });
        }
    }
    return _env;
}

export function getApiToken() {
    if (process.env['ROMPT_API_TOKEN']) {
        return process.env['ROMPT_API_TOKEN'];
    } else {
        const _apiToken = ephemeralDotenv()['ROMPT_API_TOKEN'];
        if (_apiToken) {
            return _apiToken;
        } else {
            throw new Error('ROMPT_API_TOKEN not found');
        }
    }
}

export const debugLog = (env: "prod" | string, ...messages: any) => {
    if (env !== "prod") {
        console.log(...messages);
    }
}