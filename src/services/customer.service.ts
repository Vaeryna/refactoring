import {Customer} from "../models/customerSchema.ts";
import {readFile} from "../utils/readFile.ts";

export function parseCustomer(fileName: string): Record<string, Customer> {

    const data = readFile(fileName).split(/\r?\n/).filter(l => l.trim());

    const customers: Record<string, Customer> = {}

    if (data != undefined) {
        try {
            for (let i = 1; i < data.length; i++) {

                const parts = data[i].split(',');

                const id: string = parts[0];
                customers[id] = {
                    id: parts[0],
                    name: parts[1],
                    level: parts[2] || 'BASIC',
                    shipping_zone: parts[3] || 'ZONE1',
                    currency: parts[4] || 'EUR'
                }
            }
        } catch (e) {
            throw e;
        }
        return customers
    } else throw new Error("No Customer Found");
}