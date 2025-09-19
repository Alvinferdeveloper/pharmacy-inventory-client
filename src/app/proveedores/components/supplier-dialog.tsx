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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Supplier } from "@/app/proveedores/types/supplier.dto"
import { AddSupplierPayload } from "@/app/hooks/useAddSupplier"
import { UpdateSupplierPayload } from "@/app/hooks/useUpdateSupplier"
import { Alert, AlertDescription } from "@/components/ui/alert"

const supplierSchema = z.object({
    supplierName: z.string().min(1, "El nombre es requerido"),
    email: z.string().email("Email inválido"),
    phone: z.string()
        .min(1, "El teléfono es requerido")
        .regex(/^\d{8}$/, { message: "El teléfono debe tener exactamente 8 dígitos numéricos" }),
    address: z.string().min(1, "La dirección es requerida"),
})

type SupplierSchema = z.infer<typeof supplierSchema>

interface SupplierDialogProps {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    onSave: (data: AddSupplierPayload | UpdateSupplierPayload) => void
    supplier: Supplier | null
    isSaving: boolean
    error: Error | null
}

export function SupplierDialog({ isOpen, onOpenChange, onSave, supplier, isSaving, error }: SupplierDialogProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<SupplierSchema>({
        resolver: zodResolver(supplierSchema),
    })

    useEffect(() => {
        if (isOpen) {
            if (supplier) {
                reset(supplier)
            } else {
                reset({
                    supplierName: "",
                    email: "",
                    phone: "",
                    address: "",
                })
            }
        }
    }, [supplier, isOpen, reset])

    const onSubmit = (data: SupplierSchema) => {
        onSave(data)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{supplier ? "Editar Proveedor" : "Nuevo Proveedor"}</DialogTitle>
                    <DialogDescription>
                        {supplier ? "Modifica la información del proveedor" : "Completa los datos del nuevo proveedor"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="supplierName">Nombre del Proveedor</Label>
                        <Input id="supplierName" {...register("supplierName")} placeholder="Ej: Medicasp" />
                        {errors.supplierName && <p className="text-red-500 text-xs mt-1">{errors.supplierName.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" {...register("email")} placeholder="ejemplo@correo.com" />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Teléfono</Label>
                            <Input id="phone" {...register("phone")} placeholder="88888888" type="number" />
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Dirección</Label>
                        <Input id="address" {...register("address")} placeholder="Dirección completa" />
                        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
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
                            {isSaving ? "Guardando..." : (supplier ? "Actualizar" : "Crear") + " Proveedor"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
