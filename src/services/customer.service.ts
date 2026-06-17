import {Customer, customerSchema} from "../models/customerSchema.ts";
import {readFile} from "../utils/readFile.ts";

/**
 * Fonction pour transformer le fichier reçu en objet JSON
 * @param fileName nom du fichier à transformer en objet JSON. Le chemin complet se trouve dans config.ts
 */
export function parseCustomer(fileName: string): Record<string, Customer> {

    const data = readFile(fileName).split(/\r?\n/).filter(l => l.trim());

    const customers: Record<string, Customer> = {}

    if (data.length <= 1) {
        throw new Error(`Customers file is empty or invalid: ${fileName}`);
    }

    for (let i = 1; i < data.length; i++) {

        const parts = data[i].split(',');

        const id: string = parts[0];

        if (!id) {
            throw new Error(`Missing customer id at line ${i + 1}`);
        }

        customers[id] = customerSchema.parse({
            id,
            name: parts[1],
            level: parts[2] ? parts[2] : undefined,
            shipping_zone: parts[3] ? parts[3] : undefined,
            currency: parts[4] ? parts[4] : undefined,
        })
    }

    return customers
}

