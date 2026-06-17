import fs from "fs";
import {DATA_FOLDER} from "../config.ts";
import path from "path";

export function readFile(fileName: string): string {
    const link = path.join(DATA_FOLDER, fileName)

    return fs.readFileSync(link, 'utf-8');
}