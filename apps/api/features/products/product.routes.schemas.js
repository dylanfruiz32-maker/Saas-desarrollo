import * as z from 'zod';
import { productSchema } from './product.schemas.js';

export const createProductRouteSchema = {
  body: productSchema.pick({
    name: true,
    sku: true,
    price: true,
    cost: true,
    current_stock: true,
    minimum_stock: true,
  }),
  params: null,
  query: null,
};

export const getProductsRouteSchema = {
  body: null,
  params: null,
  query: null,
};

export const getProductByIdRouteSchema = {
  body: null,
  params: z.object({
    id: z.coerce.number({ error: 'No es un id valido' }),
  }),
  query: null,
};

export const updateProductRouteSchema = {
  body: productSchema.pick({
    name: true,
    sku: true,
    price: true,
    cost: true,
    current_stock: true,
    minimum_stock: true,
  }).partial(),
  params: z.object({
    id: z.coerce.number({ error: 'No es un id valido' }),
  }),
  query: null,
};

export const deleteProductRouteSchema = {
  body: null,
  params: z.object({
    id: z.coercer.number({ error: 'No es un id valido' }),
  }),
  query: null,
}

