import * as z from 'zod';

export const createCategoryRouteSchema = {
    body: z.object({
        name: z.string().min(3, { message: 'El nombre de la categoria demasiado corto'}),
    }),
    params: null,
    query: null,
};

export const createAttributeRouteSchema = ({
    body: z.object({
        category_id: z.number({ message: 'El id de la categoría es requerido' }),
        name: z.string().min(1, { message: 'El nombre del atributo no puede estar vacio' })
    }),
    params: null,
    query: null,
});