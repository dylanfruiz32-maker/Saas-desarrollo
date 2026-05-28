import { Router } from 'express'
import {
  createProductRouteSchema,
  deleteProductRouteSchema,
  updateProductRouteSchema,
} from './product.routes.schemas.js';
import productRepository from './product.repository.js';
const productRouter = Router()

//Ruta para crear un producto
productRouter.post('/', async (req, res) => {
  //1. Validar el requerimiento
  const body = createProductRouteSchema.body.parse(req.body);

  //2.Guardarlo en db
  const createdProduct = await productRepository.createProduct({
    userId: req.user.id,
    name: body.name,
    sku: body.sku,
    price: body.price,
    cost: body.cost,
    current_stock: body.current_stock,
    minimum_stock: body.minimum_stock,
  });

  //3. Responder con el producto guardado 
  return res.status(201).json(createdProduct)
});

//Ruta para obtener los productos del usuario
productRouter.get('/', async (req, res) => {
  //1. Obtener los productos en db
  const products = await productRepository.getProducts(req.user.id);

  //2. Responder con los productos 
  return res.status(200).json(products)
});

//Ruta para actualizar un producto 
productRouter.put('/:id', async (req, res) => {
  //1. Validar el requerimiento 
  const body = updateProductRouteSchema.body.parse(req.body);
  const params = updateProductRouteSchema.params.parse(req.params);

  //2. Guardarlo en db 
  const updatedProduct = await productRepository.updateProduct({
    userId: req.user.id,
    name: body.name,
    sku: body.sku,
    price: body.price,
    cost: body.cost,
    current_stock: body.current_stock,
    minimum_stock: body.minimum_stock,
    id: params.id,
  });

  //3. Responder con el contacto actualizadod
  return res.status(200).json(updatedProduct)
});

// Ruta para eliminar un producto 
productRouter.delete('/:id', async (req, res) => {
  //1. Validar el requerimiento 
  const params = deleteProductRouteSchema.params.parse(req.params);

  //2. Borrarlo en db
  const deletedProduct = await productRepository.softDeleteProduct({
    id: params.id,
    userId: req.user.id,
  });

  //3. Responder con el producto eliminado 
  return res.status(200).json(deletedProduct);
});

export default productRouter