import {readFile} from "../utils/readFile.ts";
import {ShippingZoneSchema, shippingZoneSchema} from "../models/shippingZoneSchema.ts";

export function parseShippingZone(fileName: string): Record<string, ShippingZoneSchema> {

    const data = readFile(fileName).split(/\r?\n/).filter(l => l.trim());

    if (data.length <= 1) {
        throw new Error(`Shipping zones file is empty or invalid: ${fileName}`);
    }

    const shippingZone: Record<string, ShippingZoneSchema> = {}


    for (let i = 1; i < data.length; i++) {

        const parts = data[i].split(',');

        const zone: string = parts[0];

        if (!zone) {
            throw new Error(`Missing zone at line ${i + 1}`);
        }

        shippingZone[zone] = shippingZoneSchema.parse({
            zone,
            base: parseFloat(parts[1]),
            per_kg: parseFloat(parts[2]) ? parseFloat(parts[2]) : undefined,
        })
    }

    return shippingZone

}