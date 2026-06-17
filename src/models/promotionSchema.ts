import {z} from "zod";

export const promotionSchema = z.object(
    {
        code: z.string(),
        type: z.enum(["PERCENTAGE", "FIXED"]),
        value: z.string(),
        active: z.boolean().default(true),
    }
)

export type PromotionSchema = z.infer<typeof promotionSchema>;