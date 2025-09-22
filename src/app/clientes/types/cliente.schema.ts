import { z } from 'zod';

export const clientSchema = z.object({
  customerName: z.string().min(1, { message: 'El nombre del cliente es requerido' }),
  identification: z.string().regex(/^\d{3}-\d{6}-\d{4}[A-Z]$/, { message: 'La identificación debe tener el formato 000-000000-0000A' }).optional().or(z.literal('')),
  phone: z.string().regex(/^\d{8}$/, { message: 'El teléfono debe tener 8 dígitos' }).optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
});

export type ClientSchema = z.infer<typeof clientSchema>;
