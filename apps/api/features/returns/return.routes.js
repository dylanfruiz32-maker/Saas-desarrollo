import { Router } from 'express';
import {
  createReturnRouteSchema,
  deleteProductReturnRouteSchema,
  updateReturnRouteSchema,
} from './return.routes.schemas.js';
import returnRepository from './return.repository.js';
const returnRouter = Router();

// Ruta para crear una devolución
returnRouter.post('/', async (req, res) => {
  // 1. Validar el requerimiento
  const body = createReturnRouteSchema.body.parse(req.body);

  // 2. Guardarlo en db
  const createdReturn = await returnRepository.createReturn({
    product_id: body.product_id,
    quantity: body.quantity,
    reason: body.reason,
    userId: req.user.id,
  });

  // 3. Responder con la devolución creada
  return res.status(201).json(createdReturn);
});

// Ruta para obtener el historial de devoluciones del dueño de la tienda
returnRouter.get('/', async (req, res) => {
  // 1. Obtener los productos en db
  const returns = await returnRepository.getReturnsByUserId(req.user.id);

  // 2. Responder con los productos
  return res.status(200).json(returns);
});

// Ruta para actualizar una devolución
returnRouter.put('/:id', async (req, res) => {
  // 1. Validar el requerimiento
  const body = updateReturnRouteSchema.body.parse(req.body);
  const params = updateReturnRouteSchema.params.parse(req.params);

  // 2. Guardarlo en db
  const updatedReturn = await returnRepository.updateReturn({
    id: params.id,
    quantity: body.quantity,
    reason: body.reason,
    userId: req.user.id,
  });

  // 3. Responder con la devolución actualizada
  return res.status(200).json(updatedReturn);
});

// Ruta para eliminar una devolución
returnRouter.delete('/:id', async (req, res) => {
  // 1. Validar el requerimiento
  const params = deleteProductReturnRouteSchema.params.parse(req.params);

  // 2. Borrarlo en db
  const deletedReturn = await returnRepository.deleteReturn({
    id: params.id,
    userId: req.user.id,
  });

  // 3. Responder con la devolución eliminada
  return res.status(200).json(deletedReturn);
});

export default returnRouter;