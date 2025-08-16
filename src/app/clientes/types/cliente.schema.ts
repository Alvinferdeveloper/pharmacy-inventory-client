import { z } from 'zod';

export const clientSchema = z.object({
  customerName: z.string().min(1, { message: 'El nombre del cliente es requerido' }),
  identification: z.string().regex(/^\d{3}-\d{6}-\d{4}[A-Z]$/, { message: 'La identificación debe tener el formato 000-000000-0000A' }),
  phone: z.string().regex(/^\d{8}$/, { message: 'El teléfono debe tener 8 dígitos' }),
  address: z.string().min(1, { message: 'La dirección es requerida' }),
});

export type ClientSchema = z.infer<typeof clientSchema>;
