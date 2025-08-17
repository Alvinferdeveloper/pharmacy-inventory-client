"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useCategories } from "@/app/hooks/useCategories"
import { useSuppliers } from "@/app/hooks/useSuppliers"
import { Product } from "@/app/hooks/useProducts"
import { AddProductPayload } from "@/app/hooks/useAddProduct"
import { UpdateProductPayload } from "@/app/hooks/useUpdateProduct"
import { Alert, AlertDescription } from "@/components/ui/alert"

const productSchema = z.object({
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

type ProductFormData = {
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

type ProductData = {
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

interface ProductDialogProps {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    onSave: (data: AddProductPayload | UpdateProductPayload) => void
    product: Product | null
    isSaving: boolean
    error: Error | null
}

export function ProductDialog({ isOpen, onOpenChange, onSave, product, isSaving, error }: ProductDialogProps) {
    const { data: categories, isLoading: isLoadingCategories } = useCategories()
    const { data: suppliers, isLoading: isLoadingSuppliers } = useSuppliers()

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            code: "",
            productName: "",
            description: "",
            purchasePrice: 0,
            sellingPrice: 0,
            stock: 0,
            expirationDate: "",
        },
    })

    useEffect(() => {
        if (!isOpen) {
            reset({
                code: "",
                productName: "",
                description: "",
                purchasePrice: 0,
                sellingPrice: 0,
                stock: 0,
                expirationDate: "",
                idCategory: undefined,
                idSupplier: undefined,
            })
        } else if (product) {
            reset({
                code: product.code,
                productName: product.productName,
                description: product.description,
                purchasePrice: Number(product.purchasePrice),
                sellingPrice: Number(product.sellingPrice),
                stock: Number(product.stock),
                expirationDate: product.expirationDate,
                idCategory: product.category.idCategory,
                idSupplier: product.supplier.idSupplier,
            })
        }
    }, [product, isOpen, reset])

    const onSubmit = (formData: ProductFormData) => {
        // Transform the form data to match the expected type
        const transformedData: ProductData = {
            ...formData,
            purchasePrice: Number(formData.purchasePrice),
            sellingPrice: Number(formData.sellingPrice),
            stock: Math.floor(Number(formData.stock)),
            idCategory: formData.idCategory ? Number(formData.idCategory) : undefined,
            idSupplier: formData.idSupplier ? Number(formData.idSupplier) : undefined,
        }
        if (product) {
            onSave({ ...transformedData } as UpdateProductPayload)
        } else {
            onSave(transformedData as AddProductPayload)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{product ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
                    <DialogDescription>
                        {product ? "Modifica la información del producto" : "Completa los datos del nuevo producto"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="code">Código</Label>
                            <Input id="code" {...register("code")} placeholder="Ej: 25221111" />
                            {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="stock">Stock</Label>
                            <Input id="stock" type="number" {...register("stock")} placeholder="0" min="0" />
                            {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="productName">Nombre del Producto</Label>
                        <Input id="productName" {...register("productName")} placeholder="Ej: Alkazeltzer 80" />
                        {errors.productName && <p className="text-red-500 text-xs mt-1">{errors.productName.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea id="description" {...register("description")} placeholder="Descripción del producto" rows={3} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="purchasePrice">Precio de Compra</Label>
                            <Input id="purchasePrice" type="number" step="0.01" {...register("purchasePrice")} placeholder="0.00" min="0" />
                            {errors.purchasePrice && <p className="text-red-500 text-xs mt-1">{errors.purchasePrice.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="sellingPrice">Precio de Venta</Label>
                            <Input id="sellingPrice" type="number" step="0.01" {...register("sellingPrice")} placeholder="0.00" min="0" />
                            {errors.sellingPrice && <p className="text-red-500 text-xs mt-1">{errors.sellingPrice.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="expirationDate">Fecha de Vencimiento</Label>
                        <Input id="expirationDate" type="date" {...register("expirationDate")} />
                        {errors.expirationDate && <p className="text-red-500 text-xs mt-1">{errors.expirationDate.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">Categoría</Label>
                            <Controller
                                name="idCategory"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(val) => field.onChange(val === "" ? undefined : Number(val))}
                                        value={field.value !== undefined ? String(field.value) : ""}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar categoría" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {isLoadingCategories ? (
                                                <SelectItem value="loading">Cargando...</SelectItem>
                                            ) : (
                                                categories?.map((category) => (
                                                    <SelectItem key={category.idCategory} value={String(category.idCategory)}>
                                                        {category.categoryName}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.idCategory && <p className="text-red-500 text-xs mt-1">{errors.idCategory.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="supplier">Proveedor</Label>
                            <Controller
                                name="idSupplier"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(val) => field.onChange(val === "" ? undefined : Number(val))}
                                        value={field.value !== undefined ? String(field.value) : ""}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar proveedor" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {isLoadingSuppliers ? (
                                                <SelectItem value="loading">Cargando...</SelectItem>
                                            ) : (
                                                suppliers?.map((supplier) => (
                                                    <SelectItem key={supplier.idSupplier} value={String(supplier.idSupplier)}>
                                                        {supplier.supplierName}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.idSupplier && <p className="text-red-500 text-xs mt-1">{errors.idSupplier.message}</p>}
                        </div>
                    </div>

                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error.message}</AlertDescription>
                        </Alert>
                    )}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSaving}>
                            {isSaving ? "Guardando..." : `${product ? "Actualizar" : "Crear"} Producto`}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
