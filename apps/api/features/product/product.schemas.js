import * as z from 'zod';

export const productSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  category_id: z.number().nullable(),
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  sku: z.string().min(3, 'El SKU debe tener al menos 3 caracteres' ),
  price: z.number().nonnegative('El precio no puede ser negativo'),
  cost: z.number().nonnegative('El costo no puede ser negativo'),
  current_stock: z.number().int().default(0),
  minimum_stock: z.number().int().default(5),
  deleted_at: z.date().nullable(),
});

/** @typedef {z.infer<typeof productSchema>} Product */
