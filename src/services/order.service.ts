import type {Order} from "../models/ordersSchema.ts";
import {getMorningBonus, getPromotionsDiscount} from "./discount.service.ts";
import {Promotion} from "../models/promotionSchema.ts";


export function calculateLineSubtotal(order: Order): number {
    return order.unit_price * order.qty;
}

export function calculateLineTotalAfterDiscounts(
    order: Order,
    promotions: Record<string, Promotion>
): {
    total: number;
    promotionDiscount: number;
    morningBonus: number;
} {
    const lineSubtotal = calculateLineSubtotal(order);

    const promotion = getPromotionsDiscount(order, promotions);

    const promotionDiscount =
        lineSubtotal * promotion.discountRate
        + promotion.fixedDiscount * order.qty;

    const afterPromotion = lineSubtotal - promotionDiscount;

    const morningBonus = afterPromotion * getMorningBonus(order);

    return {
        total: afterPromotion - morningBonus,
        promotionDiscount,
        morningBonus,
    };
}