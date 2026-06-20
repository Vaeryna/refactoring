import {calculateLineTotalAfterDiscounts} from "./order.service.ts";
import {Order} from "../models/ordersSchema.ts";
import {Promotion} from "../models/promotionSchema.ts";
import {Product} from "../models/productSchema.ts";

function createEmptySummary() {
    return {
        subtotal: 0,
        items: [],
        weight: 0,
        promoDiscount: 0,
        morningBonus: 0,
    };
}

/**
 * Groupement par client
 */

export function totalsByCustomers(
    orders: Record<string, Order>,
    promotions: Record<string, Promotion>,
    products: Record<string, Product>
){

    const summaries: Record<string, any> = {};
    for (const order of Object.values(orders)) {
        const customerId = order.customer_id;

        if (!summaries[customerId]) {
            summaries[customerId] = createEmptySummary();
        }
        const line = calculateLineTotalAfterDiscounts(order, promotions, products);

        const product = products[order.product_id] ?? {};

        summaries[customerId].weight += (product.weight || 1.0) * order.qty;
        summaries[customerId].subtotal += line.total;
        summaries[customerId].promoDiscount += line.promotionDiscount;
        summaries[customerId].morningBonus += line.morningBonus;
        summaries[customerId].items.push(order);
    }

    return summaries;
}