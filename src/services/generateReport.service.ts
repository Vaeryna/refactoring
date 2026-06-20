import {Customer} from "../models/customerSchema.ts";
import {Order} from "../models/ordersSchema.ts";
import {Product} from "../models/productSchema.ts";
import {ShippingZone} from "../models/shippingZoneSchema.ts";
import {Summary} from "../models/summarySchema.ts";
import {
    calculateLoyaltyDiscount,
    calculateTierDiscount,
    checkMaxDiscount,
    getWeekEndBonus
} from "./discount.service.ts";
import {getLoyaltyPointsByCustomer} from "./customer.service.ts";
import {
    calculateShippingPrice,
    calculateTaxAllTaxable,
    calculateTaxNotAllTaxable,
    checkTaxable
} from "./shipping.service.ts";
import {getManagementPrice} from "./management.service.ts";

export function generateReport(summaries: Record<string, Summary>, customers: Record<string, Customer>, orders: Record<string, Order>, products: Record<string, Product>, shippingZones: Record<string, ShippingZone>) {


    const sortedCustomerIds = Object.keys(summaries).sort();
    let totalPrice = 0;
    let totalTaxCollected = 0;
    const reports: string[] = [];


    for (const cid of sortedCustomerIds) {
        const cust = customers[cid] || {};
        const name = cust.name || 'Unknown';
        const level = cust.level || 'BASIC';
        const zone = cust.shipping_zone || 'ZONE1';
        const currency = cust.currency || 'EUR';

        const subTotal = summaries[cid].subtotal;

        let discount = 0
        let totalTax = 0
        let taxAmount = subTotal - discount;

        const tierDiscount = calculateTierDiscount(subTotal, level)

        const weekendBonus = getWeekEndBonus(summaries[cid].items[0]?.date || '')

        const loyaltyPoints = getLoyaltyPointsByCustomer(cid, orders)

        const loyaltyDiscount = calculateLoyaltyDiscount(loyaltyPoints)

        let totalDiscount = subTotal * tierDiscount + discount * weekendBonus

        const totalMaxDiscount = checkMaxDiscount(totalDiscount, loyaltyDiscount)

        const allTaxable = checkTaxable(summaries[cid], products)

        if (allTaxable) totalTax = calculateTaxAllTaxable(taxAmount)
        else totalTax = calculateTaxNotAllTaxable(totalTax, taxAmount, summaries[cid], products)

        const shippingPrice = calculateShippingPrice(summaries[cid], subTotal, zone, shippingZones)

        const managementPrice = getManagementPrice(summaries[cid], currency)


        const total = Math.round((totalDiscount + taxAmount + shippingPrice + managementPrice.handling) * managementPrice.currencyRate * 100) / 100

        totalPrice += total;
        totalTax += taxAmount * managementPrice.currencyRate


        /**
         * Génération du rapport sous la variable "Report"
         */

        reports.push(`Customer: ${name} (${cid})`);
        reports.push(`Level: ${level} | Zone: ${zone} | Currency: ${currency}`);
        reports.push(`Subtotal: ${subTotal.toFixed(2)}`);
        reports.push(`Discount: ${totalDiscount.toFixed(2)}`);
        reports.push(`  - Volume discount: ${tierDiscount.toFixed(2)}`);
        reports.push(`  - Loyalty discount: ${loyaltyDiscount.toFixed(2)}`);

        if (parseFloat(summaries[cid].morningBonus) > 0) {
            reports.push(
                `  - Morning bonus: ${parseFloat(summaries[cid].morningBonus).toFixed(2)}`
            );
        }

        reports.push(
            `Tax: ${(totalTax * managementPrice.currencyRate).toFixed(2)}`
        );

        reports.push(
            `Shipping (${zone}, ${summaries[cid].weight?.toFixed(1)}kg): ${shippingPrice.toFixed(2)}`
        );

        if (managementPrice.handling > 0) {
            reports.push(
                `Handling (${summaries[cid].items.length} items): ${managementPrice.handling.toFixed(2)}`
            );
        }

        reports.push(`Total: ${total.toFixed(2)} ${currency}`);
        reports.push(`Loyalty Points: ${Math.floor(loyaltyPoints)}`);
        reports.push("");

    }
    reports.push(`Grand Total: ${totalPrice.toFixed(2)} EUR`);
    reports.push(`Total Tax Collected: ${totalTaxCollected.toFixed(2)} EUR`);

    return reports.join("\n");

}