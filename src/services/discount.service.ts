import {Order} from "../models/ordersSchema.ts";
import {Promotion} from "../models/promotionSchema.ts";
import {getActivePromotion} from "./promotion.service.ts";
import {
    DISCOUNT_THRESHOLD_1,
    DISCOUNT_THRESHOLD_2,
    DISCOUNT_THRESHOLD_3,
    DISCOUNT_THRESHOLD_PREMIUM,
    MORNING_DISCOUNT_RATE
} from "../global.constants.ts";


/**
 * Récupération des taux de promotions en cours
 * @param order commande où appliquer les taux
 * @param promotions liste des promotions disponibles
 */

export function getPromotionsDiscount(order: Order, promotions: Record<string, Promotion>) {

    const promotion = getActivePromotion(order.promo_code, promotions);

    if (!promotion) return {discountRate: 0, fixedDiscount: 0};
    if (promotion.type === "PERCENTAGE") return {discountRate: Number(promotion.value) / 100, fixedDiscount: 0};
    if (promotion.type === "FIXED") return {discountRate: 0, fixedDiscount: Number(promotion.value)};

    return {discountRate: 0, fixedDiscount: 0}
}


/**
 * Calcul du taux de reduction en cas de commande matinale
 * @param order commande pour laquelle le bonus est calculé
 * Renvoie le pourcentage bonus à appliquer
 */
export function getMorningBonus(order: Order): number {

    if (!order.time) throw new Error(`Missing order time for order : ${order.id}`);

    const hour = parseInt(order.time.split(":")[0])

    if (hour < 10) return MORNING_DISCOUNT_RATE;
    else return 0

}

/**
 * Calcul de la reduction en cas de commande en week-end
 * Renvoie le pourcentage bonus à appliquer
 * @param date
 */

export function getWeekEndBonus(date: string): number {
    if (!date) throw new Error(`Missing date time : ${date}`);

    const dayOfWeek = date ? new Date(date).getDay() : 0;

    if (dayOfWeek === 0 || dayOfWeek === 6) return 1.05
    else return 0

}

/**
 * Calcul de la réduction par total de la commande
 * @param subTotal
 * @param customerLevel
 */
export function calculateTierDiscount(subTotal: number, customerLevel: string): number {
    let discount = 0.0;

    if (subTotal > 50) {
        discount = subTotal * DISCOUNT_THRESHOLD_1;
    }
    if (subTotal > 100) {
        discount = subTotal * DISCOUNT_THRESHOLD_2
    }
    if (subTotal > 500) {
        discount = subTotal * DISCOUNT_THRESHOLD_3;
    }
    if (subTotal > 1000 && customerLevel === 'PREMIUM') {
        discount = subTotal * DISCOUNT_THRESHOLD_PREMIUM;
    }

    return discount;

}

export function calculateLoyaltyDiscount(loyaltyPoint: number): number {
    if (!loyaltyPoint) throw new Error(`Missing loyalty point`);

    if (loyaltyPoint > 100) return Math.min(loyaltyPoint * 0.1, 50.0);

    if (loyaltyPoint > 500) return Math.min(loyaltyPoint * 0.15, 100.0);

    else return 1
}