import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email("Correo no válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const registerSchema = loginSchema.extend({
  username: z.string().min(3, "El nombre de usuario es muy corto"),
});