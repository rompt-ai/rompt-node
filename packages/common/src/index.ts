import { readFileSync } from 'fs';
import { resolve } from 'path';

let _env: Record<string, string> | undefined;

export function ephemeralDotenv() {
    if (!_env) {
        const envFilePath = resolve(process.cwd(), '.env');
        const content = readFileSync(envFilePath, 'utf-8');
        const lines = content.split('\n');
        _env = {};

        lines.forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
                _env![key.trim()] = value.trim();
            }
        });
    }

    return _env;
}