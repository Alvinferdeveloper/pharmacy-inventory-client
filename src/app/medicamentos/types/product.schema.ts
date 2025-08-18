import { z } from "zod";

export const productSchema = z.object({
    code: z.string().min(1, "El código es requerido"),
    productName: z.string().min(1, "El nombre es requerido"),
    description: z.string(),
    purchasePrice: z.union([z.string(), z.number()])
        .transform(val => typeof val === 'string' ? parseFloat(val) : val)
        .refine(val => !isNaN(val), { message: "Debe ser un número" })
        .refine(val => val >= 0, { message: "El precio debe ser positivo" }),
    sellingPrice: z.union([z.string(), z.number()])
        .transform(val => typeof val === 'string' ? parseFloat(val) : val)
        .refine(val => !isNaN(val), { message: "Debe ser un número" })
        .refine(val => val >= 0, { message: "El precio debe ser positivo" }),
    stock: z.union([z.string(), z.number()])
        .transform(val => typeof val === 'string' ? parseInt(val) : Math.floor(val))
        .refine(val => !isNaN(val), { message: "Debe ser un número" })
        .refine(val => val >= 0, { message: "El stock debe ser positivo" }),
    expirationDate: z.string().min(1, "La fecha es requerida"),
    idCategory: z.union([z.string(), z.number()])
        .transform(val => val ? Number(val) : undefined)
        .optional(),
    idSupplier: z.union([z.string(), z.number()])
        .transform(val => val ? Number(val) : undefined)
        .optional(),
})

export type ProductFormData = {
    code: string
    productName: string
    description: string
    purchasePrice: string | number
    sellingPrice: string | number
    stock: string | number
    expirationDate: string
    idCategory?: string | number
    idSupplier?: string | number
}

export type ProductData = {
    code: string
    productName: string
    description: string
    purchasePrice: number
    sellingPrice: number
    stock: number
    expirationDate: string
    idCategory?: number
    idSupplier?: number
}