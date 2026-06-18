import {Promotion} from "../models/promotionSchema.ts";


/**
 * Vérifie si un code promotionnel entré dans la commande est actif
 * @param promoCode
 * @param promotions
 */

export function getActivePromotion(
    promoCode: string | undefined,
    promotions: Record<string, Promotion>
): Promotion | undefined {

    if (!promoCode) return undefined;

    const promotion = promotions[promoCode];

    if (!promotion || !promotion.active) return undefined;

    return promotion;
}