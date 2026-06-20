import {type Order} from "../models/ordersSchema.ts";
import {LOYALTY_RATIO} from "../global.constants.ts";

/**
 * Renvoie les points de fidélité de tous les clients
 * @param orders
 */
export function calculateLoyaltyPoints(orders: Record<string, Order>): Record<string, number> {
    const loyaltyPoints: Record<string, number> = {};

    for (const o of Object.values(orders)) {
        const cid = o.customer_id;
        if (!loyaltyPoints[cid]) {
            loyaltyPoints[cid] = 0;
        }
        loyaltyPoints[cid] += o.qty * o.unit_price * LOYALTY_RATIO;
    }
    return loyaltyPoints;
}


/**
 * Renvoie les points de fidélité d'un client demandé
 * @param customerID
 * @param orders
 */
export function getLoyaltyPointsByCustomer(customerID: string, orders: Record<string, Order>): number {
    if (!customerID) throw new Error(`Missing customer ID`);
    if (!orders) throw new Error(`Missing orders list`);

    const allLoyaltyPoints = calculateLoyaltyPoints(orders)

    for (const [cid, points] of Object.entries(allLoyaltyPoints)) {
        if (cid === customerID) return points;
    }
    return 0;
}


/**
 * Calcul du prix additionné de chaque commande d'un client sans les remises et promotions
 * @param customerID ID du client
 * @param orders toutes les commandes passées
 */

export function getBrutOrderPriceByCustomer(customerID: string, orders: Record<string, Order>) {
    let total: number = 0
    const ordersValues = Object.values(orders);

    if (!customerID) throw new Error("Customer ID is required");
    if (!orders) throw new Error("Orders is required");

    for (const order of ordersValues) {
        if (order.customer_id === customerID) {
            total += order.unit_price * order.qty;
        }
    }
    return total
}



