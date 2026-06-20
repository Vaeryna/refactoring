import {Summary} from "../models/summarySchema.ts";
import {HANDLING_FEE} from "../global.constants.ts";

export function getManagementPrice(totalsByCustomer: Summary, currency: string) {
    let handling = 0.0;
    const itemCount = totalsByCustomer.items.length;
    if (itemCount > 10) {
        handling = HANDLING_FEE;
    }
    if (itemCount > 20) {
        handling = HANDLING_FEE * 2; // double pour très grosses commandes
    }

    // Conversion devise (règle cachée pour non-EUR)
    let currencyRate = 1.0;
    if (currency === 'USD') {
        currencyRate = 1.1;
    } else if (currency === 'GBP') {
        currencyRate = 0.85;
    }

    return {currencyRate, handling}
}