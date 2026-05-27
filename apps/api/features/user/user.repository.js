import db from '../../db/index.js';

/** @typedef {import('./user.schemas.js').User} User */

/**
 * Crea un usuario en la base de datos para la intranet
 * @param {Object} payload
 * @param {string} payload.name - Nombre completo del empleado
 * @param {string} payload.email - El correo del usuario
 * @param {string} payload.passwordHash - La contraseña encriptada
 * @returns {Promise<User>} El usuario creado
 */
const createUser = async ({ name, email, passwordHash }) => {
  const res = await db.query(
    `
    INSERT INTO users (name, email, password_hash)
    VALUES ($1, $2, $3) RETURNING *
  `, 
    [name, email, passwordHash],
);
  
  const createdUser = res.rows[0];
  return createdUser;
};

/**
 * Elimina un usuario en la base de datos
 * @param {User['id']} id - El id del usuario a eliminar
 * @returns {void}
 */
const deleteUserById = async (id) => {
await db.query('DELETE FROM users WHERE id = $1 ', [id]);
};

/**
 * Encuentra un usuario en la base de datos
 * @param {User['email']} email - El correo del usuario
 * @returns {User} El usuario encontrado
 */
const findUserByEmail = async (email) => {
  const res = await db.query('SELECT * FROM users WHERE email = $1',[email]);
  const user = res.rows[0];
  return user;
};

/**
 * Obtener todos los usuarios
 * @returns {User[]} Los usuarios encontrados
 */
const findUsers = async () => {
  const res = await db.query('SELECT * FROM users');
  const users = res.rows;
  return users;
};

/**
 * Actualiza la propiedad del email de los usuarios
 * @param {string} Id - El id del usuario a actualizar
 * @returns {void}
 */
const updateEmailVerify = async (id) => {
  await db.query(
    `
    UPDATE users 
    SET email_verified = true
    WHERE id = $1
  `, 
  [id]
);
};

const userRepository = {
  createUser,
  deleteUserById,
  findUserByEmail,
  findUsers,
  updateEmailVerify,
};

export default userRepository;
