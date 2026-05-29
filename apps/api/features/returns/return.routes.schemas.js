import * as z from 'zod';
import { returnSchema } from './return.schemas.js';

export const createReturnRouteSchema = {
  body: returnSchema.pick({
    product_id: true,
    quantity: true,
    reason: true,
  }),
  params: null,
  query: null,
};

export const getReturnsRouteSchema = {
  body: null,
  params: null,
  query: null,
};

export const updateReturnRouteSchema = {
  body: returnSchema.pick({
    quantity: true,
    reason: true,
  }).partial(),
  params: z.object({
    id: z.coerce.number({ error: 'No es un id valido' }),
  }),
  query: null,
};

export const deleteProductReturnRouteSchema = {
  body: null,
  params: z.object({
    id: z.coerce.number({ error: 'No es un id valido' }),
  }),
  query: null,
};