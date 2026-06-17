import {readFile} from "../utils/readFile.ts";
import {Product} from "../models/productSchema.ts";

export function parseProducts(link: string): Record<string, Product> {

    const data = readFile(link).split(/\r?\n/).filter(l => l.trim());

    const products: Record<string, Product> = {}

    if (data != undefined) {
        try {
            for (let i = 1; i < data.length; i++) {

                const parts = data[i].split(',');

                const id: string = parts[0];
                products[parts[0]] = {
                    id: parts[0],
                    name: parts[1],
                    category: parts[2],
                    price: parseFloat(parts[3]),
                    weight: parseFloat(parts[4]),
                    taxable: (parts[5]) === "true"
                }
            }
        } catch (e) {
            throw e;
        }
        return products
    } else throw new Error("No Product Found");
}