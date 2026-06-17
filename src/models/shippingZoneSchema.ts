import {z} from "zod";

export const shippingZoneSchema = z.object(
    {
        zone: z.string(),
        base: z.number(),
        per_kg: z.number().default(0.5),

    }
)

export type ShippingZoneSchema = z.infer<typeof shippingZoneSchema>;