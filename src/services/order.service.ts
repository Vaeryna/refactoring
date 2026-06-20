import type {Order} from "../models/ordersSchema.ts";
import {getMorningBonus, getPromotionsDiscount} from "./discount.service.ts";
import {Promotion} from "../models/promotionSchema.ts";
import {Product} from "../models/productSchema.ts";


export function calculateLineSubtotal(
    order: Order,
    products: Record<string, Product>
): number {
    const product = products[order.product_id];
    const basePrice = product?.price !== undefined ? product.price : order.unit_price;

    return basePrice * order.qty;
}

export function calculateLineTotalAfterDiscounts(
    order: Order,
    promotions: Record<string, Promotion>,
    products: Record<string, Product>
): {
    total: number;
    promotionDiscount: number;
    morningBonus: number;
} {
    const lineSubtotal = calculateLineSubtotal(order, products)
    ;

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