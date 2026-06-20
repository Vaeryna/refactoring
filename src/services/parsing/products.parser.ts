import {readFile} from "../../utils/readFile.ts";
import {Product, productSchema} from "../../models/productSchema.ts";

export function parseProducts(fileName: string): Record<string, Product> {

    const data = readFile(fileName).split(/\r?\n/).filter(l => l.trim());

    if (data.length <= 1) {
        throw new Error(`Products file is empty or invalid: ${fileName}`);
    }
    const products: Record<string, Product> = {}

    for (let i = 1; i < data.length; i++) {

        const parts = data[i].split(',');

        const id: string = parts[0];

        if (!id) {
            throw new Error(`Missing product id at line ${i + 1}`);
        }

        products[id] = productSchema.parse({
            id,
            name: parts[1],
            category: parts[2],
            price: parseFloat(parts[3]),
            weight: parseFloat(parts[4]) ? parseFloat(parts[4]) : undefined,
            taxable: parts[5] === "true"
        })
    }

    return products

}