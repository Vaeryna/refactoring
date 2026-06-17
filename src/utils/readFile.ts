import fs from "fs";

export function readFile(link: string): string {
    return fs.readFileSync(link, 'utf-8');
}