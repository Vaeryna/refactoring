import {Order} from "../models/ordersSchema.ts";
import {Promotion} from "../models/promotionSchema.ts";
import {getActivePromotion} from "./promotion.service.ts";
import {MORNING_DISCOUNT_RATE} from "../global.constants.ts";


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

