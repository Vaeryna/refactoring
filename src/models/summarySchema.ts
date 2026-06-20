import {z} from "zod";
import {orderSchema} from "./ordersSchema.ts";

export const summarySchema = z.object({
    subtotal: z.number(),
    items: z.array(orderSchema),
    weight: z.number(),
    promoDiscount: z.number(),
    morningBonus: z.string(),
})

export type Summary = z.infer<typeof summarySchema>;