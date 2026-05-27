import { Router } from 'express';
import { createUserRouteSchema } from './user.routes.schemas.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userRepository from './user.repository.js';
import nodemailerService from '../../services/nodemailer.js';
import { CLIENT_ENDPOINT } from '../../config.js';
const userRouter = Router();

userRouter.post('/', async (req, res, next) => {
  let createdUser = null;
  try {
    // 1. Validar el requerimiento
    const body = createUserRouteSchema.body.parse(req.body);

    // 2. Encriptar la contraseña
    const passwordHash = await bcrypt.hash(body.password, 10);

    // 3. Guardar en la base de datos con los 3 campos
    createdUser = await userRepository.createUser({ 
      name: body.name, 
      email: body.email, 
      passwordHash, 
    });

    // 4. Enviar el correo de validación
    const emailToken = jwt.sign(
      { id: createdUser.id, email: createdUser.email },
      process.env.EMAIL_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    await nodemailerService.sendMail({
      to: createdUser.email,
      subject: 'Verifica tu cuenta de Intranet',
      html: `
        <div style="font-family: sans-serif;">
          <h1>¡Bienvenido, ${createdUser.name}!</h1>
          <p>Te has registrado correctamente en la plataforma de Intranet.</p>
          <p>Para comenzar a usar la plataforma, por favor confirma tu correo haciendo clic abajo:</p>
          <a href="${CLIENT_ENDPOINT}/verify/${emailToken}" 
            style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Verificar mi cuenta
          </a>
        </div>
      `,
    });

    // 5. Responder con el usuario creado
    res.status(201).json(createdUser);
  } catch (error) {
    // Si el usuario fue creado pero hubo un error, eliminamos el usuario para que el email quede libre para reintentar.
    if (createdUser) await userRepository.deleteUserById(createdUser.id);
    
    // Responder con un error genérico
    next(error);
  }
});

export default userRouter;
