import {z} from "zod";

export const customerSchema = z.object(
    {
        id: z.string(),
        name: z.string(),
        level: z.string().default("BASIC"),
        shipping_zone: z.string().default("ZONE1"),
        currency: z.string().default("EUR"),
    }
)

export type Customer = z.infer<typeof customerSchema>;