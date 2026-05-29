import db from '../../db/index.js';

/** @typedef {import('./return.schemas.js').Return} Return */

/**
 * Crea una devolución de producto en la base de datos
 * @param {Object} payload
 * @param {ProductReturn['user_id']} payload.user_id - El id del dueño de la tienda
 * @param {ProductReturn['product_id']} payload.product_id - El id del producto devuelto
 * @param {ProductReturn['quantity']} payload.quantity - La cantidad de productos devueltos
 * @param {ProductReturn['reason']} payload.reason - La razón de la devolución
 * @returns {ProductReturn} - La devolución creada
 */
const createReturn = async ({ user_id, product_id, quantity, reason }) => {
  const res = await db.query(
    `
    INSERT INTO product_returns (user_id, product_id, quantity, reason)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `, 
    [user_id, product_id, quantity, reason]
  );
  const createdProductReturn = res.rows[0];
  return createdProductReturn;
};

/**
 * Obtiene el historial de devoluciones del dueño de la tienda
 * @param {Object} payload
 * @param {ProductReturn['user_id']} payload.user_id - El id del dueño de la tienda
 * @returns {ProductReturn[]} - La lista de devoluciones con datos del producto
 */
const getReturnsByUserId = async ({ user_id }) => {
  const res = await db.query(
    `
    SELECT 
      r.*, 
      p.name AS product_name, 
      p.sku 
    FROM product_returns r
    JOIN products p ON r.product_id = p.id
    WHERE r.user_id = $1
    ORDER BY r.created_at DESC
  `,
    [user_id]
  );
  const returns = res.rows;
  return returns;
};

/**
 * Edita una devolución existente (Solo cantidad y razón)
 * @param {Object} payload
 * @param {ProductReturn['id']} payload.id - El id de la devolución a editar
 * @param {ProductReturn['user_id']} payload.user_id - El id del dueño
 * @param {ProductReturn['quantity']} payload.quantity - La nueva cantidad
 * @param {ProductReturn['reason']} payload.reason - La nueva razón
 * @returns {ProductReturn} - La devolución modificada
 */
const updateReturn = async ({ id, user_id, quantity, reason }) => {
  const res = await db.query(
    `
    UPDATE product_returns
    SET 
      quantity = $1,
      reason = $2
    WHERE id = $3 AND user_id = $4
    RETURNING *
  `,
    [quantity, reason, id, user_id]
  );
  const updatedReturn = res.rows[0];
  return updatedReturn;
};

/**
 * Elimina una devolución de la base de datos
 * @param {Object} payload
 * @param {ProductReturn['id']} payload.id - El id de la devolución a eliminar
 * @param {ProductReturn['user_id']} payload.user_id - El id del dueño
 * @returns {ProductReturn} - El registro que fue eliminado
 */
const deleteReturn = async ({ id, user_id }) => {
  const res = await db.query(
    `
    DELETE FROM product_returns
    WHERE id = $1 AND user_id = $2
    RETURNING *
  `,
    [id, user_id]
  );
  const deletedReturn = res.rows[0];
  return deletedReturn;
};

export default {
  createReturn,
  getReturnsByUserId,
  updateReturn,
  deleteReturn,
}