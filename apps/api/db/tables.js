import db from './index.js';

/**
 * Crea la tabla de usuarios en la base de datos
 * @returns {void}
 */
const createUsersTable = async () => {
  await db.query(`
    CREATE TABLE users (
      id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      email_verified BOOLEAN DEFAULT false
    )
  `);
  console.log('Tabla de usuarios creada!');
};

/**
 * Crea la tabla de contactos en la base de datos
 * @returns {void}
 */
const createContactsTable = async () => {
await db.query(`
    CREATE TABLE contacts (
      id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      user_id INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
  console.log('Tabla de contactos creada!');
};

/**
 * Crea la tabla de sesiones en la base de datos
 * @returns {void}
 */
const createSessionTable = async () => {
await db.query(`
    CREATE TABLE sessions (
      id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      jwtid TEXT UNIQUE NOT NULL,
      user_id INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
  console.log('Tabla de sesiones creada!');
};

/**
 * Crea la tabla de categorías en la base de datos
 * @returns {void}
 */
const createCategoriesTable = async () => {
  await db.query(`
    CREATE TABLE categories (
      id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL
    )
  `);
  console.log('Tabla de categorías creada!');
};

/**
 * Crea la tabla de atributos de las categorías
 * @returns {void}
 */
const createCategoryAttributesTable = async () => {
  await db.query(`
    CREATE TABLE category_attributes (
      id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
      name TEXT NOT NULL
    )
  `);
  console.log('Tabla de atributos de categorías creada!');
};

/**
 * Crea la tabla de productos en la base de datos
 * @returns {void}
 */
const createProductsTable = async () => {
  await db.query(`
    CREATE TABLE products (
      id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE, 
      category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
      name TEXT NOT NULL,
      sku TEXT NOT NULL,
      price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
      cost DECIMAL(10,2) NOT NULL CHECK (cost >= 0),
      current_stock INTEGER NOT NULL DEFAULT 0,
      minimum_stock INTEGER NOT NULL DEFAULT 5,
      deleted_at TIMESTAMP WITH TIME ZONE,
      UNIQUE (user_id, sku)
    )
  `);
  console.log('Tabla de productos creada!');
};

/**
 * Crea la tabla de devoluciones de productos en la base de datos
 * @returns {void}
 */
const createProductReturnsTable = async () => {
  await db.query(`
    CREATE TABLE product_returns (
      id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      quantity INTEGER NOT NULL CHECK (quantity >= 1),
      reason TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `);
  console.log('Tabla de devoluciones de productos creada!');
};

/**
 * Elimina las tablas de la base de datos para reiniciar el estado de la base de datos
 * @returns {void}
 */
const resetDb = async () => {
  await db.query('DROP TABLE IF EXISTS product_returns');
  await db.query('DROP TABLE IF EXISTS category_attributes');
  await db.query('DROP TABLE IF EXISTS products');
  await db.query('DROP TABLE IF EXISTS categories');
  await db.query('DROP TABLE IF EXISTS contacts');
  await db.query('DROP TABLE IF EXISTS sessions');
  await db.query('DROP TABLE IF EXISTS users');
  console.log('Tablas eliminadas');
};

/**
 * Crea las tablas de la base de datos
 * @returns {void}
 * @description Esta función se encarga de crear las tablas de la base de datos, primero elimina las tablas existentes para evitar errores de tablas ya existentes, luego crea las tablas necesarias para la aplicación.
 */
export const createTables = async () => {
  await db.connect();

  await resetDb();
  await createUsersTable();
  await createCategoriesTable();
  await createContactsTable();
  await createSessionTable();
  await createCategoryAttributesTable();
  await createProductsTable();
  await createProductReturnsTable();
  console.log('Tablas creadas');
  await db.end();
  process.exit(1);
};

createTables();