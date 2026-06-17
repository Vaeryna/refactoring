import {z} from "zod";

export const orderSchema = z.object(
    {
        id: z.string(),
        customer_id: z.string(),
        product_id: z.string(),
        qty: z.number(),
        unit_price: z.number(),
        date: z.string(),
        promo_code: z.string().default(''),
        time: z.string().default(''),
    }
)

export type Order = z.infer<typeof orderSchema>;