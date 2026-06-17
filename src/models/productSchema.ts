import {z} from "zod";

export const productSchema = z.object(
    {
        id: z.string(),
        name: z.string(),
        category: z.string().default("BASIC"),
        price: z.number(),
        weight: z.number().default(1.0),
        taxable: z.boolean().default(true),
    }
)

export type Product = z.infer<typeof productSchema>;