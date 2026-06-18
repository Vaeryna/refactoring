import {readFile} from "../../utils/readFile.ts";
import {Order, orderSchema} from "../../models/ordersSchema.ts";

export function parseOrders(fileName: string): Record<string, Order> {

    const data = readFile(fileName).split(/\r?\n/).filter(l => l.trim());

    const orders: Record<string, Order> = {}

    if (data.length <= 1) {
        throw new Error(`Orders file is empty or invalid: ${fileName}`);
    }

    for (let i = 1; i < data.length; i++) {

        const parts = data[i].split(',');

        const id: string = parts[0];

        if (!id) {
            throw new Error(`Missing order id at line ${i + 1}`);
        }

        orders[id] = orderSchema.parse({
            id,
            customer_id: parts[1],
            product_id: parts[2],
            qty: parseInt(parts[3]),
            unit_price: parseFloat(parts[4]),
            date: parts[5],
            promo_code: parts[6] ? parts[6] : undefined,
            time: parts[7] ? parts[7] : undefined,
        })
    }
    return orders
}

