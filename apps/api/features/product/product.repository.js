import db from '../../db/index.js';

/** @typedef {import('./product.schemas.js').Product} Product */

/**
 *  Crea un producto en la base de datos
 * @param {Object} payload
 * @param {Product['userId']} payload.userId - El ID del usuario
 * @param {Product['name']} payload.name - El nombre del producto
 * @param {Product['sku']} payload.sku - El SKU del producto
 * @param {Product['price']} payload.price - El precio del producto
 * @param {Product['cost']} payload.cost - El costo del producto
 * @param {Product['current_stock']} payload.current_stock - El stock actual del producto
 * @param {Product['minimum_stock']} payload.minimum_stock - El stock mínimo del producto
 * @returns {Promise<Product>} - El producto creado
 * */
const createProduct = async ({userId, name, sku, price, cost, current_stock , minimum_stock }) => {
    const res = await db.query(`
        INSERT INTO products (user_id, name, sku, price, cost, current_stock, minimum_stock)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
    `, [userId, name, sku, price, cost, current_stock, minimum_stock]);
    const newProduct = res.rows[0];
    return newProduct;
};

/**
 * Obtiene los productos de un usuario
 * @param {Product['userId']} userId - El ID del usuario
 * @return {Promise<Product[]>} - Los productos del usuario
 */
const getProducts = async (userId) => {
    const res = await db.query(`
        SELECT * FROM products
        WHERE user_id = $1 AND deleted_at IS NULL
        ORDER BY created_at DESC
    `, [userId]);
    const products = res.rows;
    return products;
};

/**
 *  Actualiza un producto en la base de datos
 * @param {Object} payload
 * @param {Product['userId']} payload.userId - El ID del usuario
 * @param {Product['name']} payload.name - El nombre del producto
 * @param {Product['sku']} payload.sku - El SKU del producto
 * @param {Product['price']} payload.price - El precio del producto
 * @param {Product['cost']} payload.cost - El costo del producto
 * @param {Product['current_stock']} payload.current_stock - El stock actual del producto
 * @param {Product['minimum_stock']} payload.minimum_stock - El stock mínimo del producto
 * @param {Product['id']} payload.id - El ID del producto
 * @returns {Product} - El producto actualizado
*/
const updateProduct = async ({ userId, name, sku, price, cost, current_stock, minimum_stock, id }) => {
    const res = await db.query(`
        UPDATE products
        SET name = $1, sku = $2, price = $3, cost = $4, current_stock = $5, minimum_stock = $6
        WHERE id = $7 AND user_id = $8 AND deleted_at IS NULL
        RETURNING *
        `, [name, sku, price, cost, current_stock , minimum_stock, id, userId]);
    const updatedProduct = res.rows[0] || null;
    return updatedProduct;
};

/**
 * Elimina un producto de la base de datos
 * @param {Product['id']} id - El ID del producto
 * @param {Product['userId']} userId - El ID del usuario
 * @return {boolean} - true si el producto fue eliminado, false si no se encontró el producto o no pertenece al usuario
 */
const softDeleteProduct = async ({ id, userId }) => {
    const res = await db.query(`
        UPDATE products
        SET deleted_at = NOW()
        WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL
        RETURNING *
    `, [id, userId]);
    const deletedProduct = res.rows[0] || null;
    return deletedProduct;
};

const productRepository = {
    createProduct,
    getProducts,
    updateProduct,
    softDeleteProduct,
};

export default productRepository;
