import {readFile} from "../utils/readFile.ts";
import {ShippingZone, shippingZoneSchema} from "../models/shippingZone.ts";

export function parseShippingZone(fileName: string): Record<string, ShippingZone> {

    const data = readFile(fileName).split(/\r?\n/).filter(l => l.trim());

    const shippingZone: Record<string, ShippingZone> = {}

    if (data != undefined) {
        try {
            for (let i = 1; i < data.length; i++) {

                const parts = data[i].split(',');

                const zone: string = parts[0];
                shippingZone[zone] = shippingZoneSchema.parse({
                    zone,
                    base: parseFloat(parts[1]),
                    per_kg: parseFloat(parts[2]) ? parseFloat(parts[2]) : undefined,
                })
            }
        } catch (e) {
            throw e;
        }
        return shippingZone
    } else throw new Error("No Shipping Zone Found");
}