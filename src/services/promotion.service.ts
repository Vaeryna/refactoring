import {readFile} from "../utils/readFile.ts";
import {PromotionSchema, promotionSchema} from "../models/promotionSchema.ts";

export function parsePromotion(fileName: string): Record<string, PromotionSchema> {

    const data = readFile(fileName).split(/\r?\n/).filter(l => l.trim());

    if (data.length <= 1) {
        throw new Error(`Promotion file is empty or invalid: ${fileName}`);
    }

    const promotions: Record<string, PromotionSchema> = {}


    for (let i = 1; i < data.length; i++) {

        const parts = data[i].split(',');

        const code: string = parts[0];

        if (!code) {
            throw new Error(`Missing promotion code at line ${i + 1}`);
        }
        promotions[code] = promotionSchema.parse({
            code,
            type: parts[1],
            value: parts[2],
            active: parts[3] ? parts[3] !== "false" : undefined,
        })
    }
    return promotions
}