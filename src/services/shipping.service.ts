import {Summary} from "../models/summarySchema.ts";
import {Product} from "../models/productSchema.ts";
import {SHIPPING_LIMIT, TAX} from "../global.constants.ts";
import {ShippingZone} from "../models/shippingZoneSchema.ts";

/**
 * Verification que tous les produits sont taxables
 * @param totalsByCustomer
 * @param products
 */
export function checkTaxable(totalsByCustomer: Summary, products: Record<string, Product>) {

    for (const item of totalsByCustomer.items) {
        const prod = products[item.product_id];

        if (prod && !prod.taxable) return false;
    }
    return true
}

/**
 * Calcul des taxes
 * @param taxAmount
 */

export function calculateTaxAllTaxable(taxAmount: number): number {
    return Math.round(taxAmount * TAX * 100) / 100
}

export function calculateTaxNotAllTaxable(totalTax: number, taxAmount: number, totalsByCustomer: Summary, products: Record<string, Product>) {

    for (const item of totalsByCustomer.items) {
        const prod = products[item.product_id];
        if (prod && prod.taxable) {
            const itemTotal = item.qty * (prod.price || item.unit_price);
            taxAmount += itemTotal * TAX;
        }
    }
    return Math.round(taxAmount * 100) / 100;
}


export function calculateShippingPrice(totalsByCustomer: Summary, subTotal: number, zone: string, shippingZones: Record<string, ShippingZone>) {
    let shippingPrice = 0;
    const weight = totalsByCustomer.weight;

    if (subTotal < SHIPPING_LIMIT) {
        const shipZone = shippingZones[zone] ?? {base: 5.0, per_kg: 0.5};
        const baseShip = shipZone.base;

        if (weight > 10) {
            shippingPrice = baseShip + (weight - 10) * shipZone.per_kg;
        } else if (weight > 5) {
            // Palier intermédiaire (règle cachée)
            shippingPrice = baseShip + (weight - 5) * 0.3;
        } else {
            shippingPrice = baseShip;
        }

        // Majoration pour livraison en zone éloignée
        if (zone === 'ZONE3' || zone === 'ZONE4') {
            shippingPrice = shippingPrice * 1.2;
        }
    } else {
        // Livraison gratuite mais frais de manutention pour poids élevé
        if (weight > 20) {
            shippingPrice = (weight - 20) * 0.25;
        }
    }
    return shippingPrice;
}