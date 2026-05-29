import * as z from 'zod';

export const returnSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  product_id: z.number(),
  quantity: z.number().int().positive('La cantidad debe ser un número entero positivo'),
  reason: z.string().min(5, 'La razón debe tener al menos 5 caracteres'),
});

/** @typedef {z.infer<typeof returnSchema>} ProductReturn */