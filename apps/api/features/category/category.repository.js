import db from '../../db/index.js';

/** @typedef {import('./category.schemas.js').Category} Category */
/** @typedef {import('./category.schemas.js').CategoryAttribute} CategoryAttribute */

/**
 * Crea una categoría en la base de datos para el inventario
 * @param {Object} payload
 * @param {string} payload.name - Nombre de la categoría
 * @param {number} payload.userId - El id del usuario
 * @returns {Promise<Category>} La categoría creada con su id
 */
const createCategory = async ({ name, userId }) => {
  const res = await db.query(
    `
    INSERT INTO categories (name, user_id)
    VALUES ($1, $2) RETURNING *
  `,
    [name, userId]
  );

  const createdCategory = res.rows[0];
  return createdCategory;
};

/**
 * Crea una atributo amarrado a una categoría
 * @param {Object} payload
 * @param {number} payload.categoryId - Id de la categoría a la que pertenece
 * @param {string} payload.name - Nombre del atributo (Ej: 'Talla')
 * @returns {Promise<CategoryAttribute>} El atributo creado
 */
const createAttribute = async ({ categoryId, name }) => {
  const res = await db.query(
    `
    INSERT INTO category_attributes (category_id, name )
    VALUES ($1, $2) RETURNING *
  `,
    [categoryId, name],
  );

  const createdAttribute = res.rows[0];
  return createdAttribute;
};

/**
 * Elimina una Categoria en la base de datos
 * @param {Category['id']} id - El id de la categoria a eliminar
 * @returns {void}
 */
const deleteCategoryById = async (id) => {
  await db.query('DELETE FROM categories WHERE user_id = $1', [id]);
};

const categoryRepository = {
  createCategory,
  createAttribute,
  deleteCategoryById,
};

export default categoryRepository;