import * as z from 'zod'

export const categorySchema = z.object({
    id: z.number(),
    user_id: z.number(),
    name: z.string(),
});

/** @typedef { z.infer<typeof categorySchema> } Category */

export const categoryAttributeSchema = z.object({
    id: z.number(),
    category_id: z.number(),
    name: z.string(),
});

/** @typedef {z.infer<typeof categoryAttributeSchema>} CategoryAttribute */