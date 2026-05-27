import * as z from 'zod';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\S]{8,}$/;

export const createUserRouteSchema = {
  body: z.object({
    name: z.string().min(3, { message: 'El nombre es demasiado corto' }),
    email: z.string().email({ message: 'Tiene que ser un email valido' }),
    password: z.string().regex(PASSWORD_REGEX, {
      message: 'Recuerda cumplir los requerimientos de la contraseña',
    }),
  }),
  params: null,
  query: null,
};
