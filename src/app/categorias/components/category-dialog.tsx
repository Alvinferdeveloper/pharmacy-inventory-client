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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Category } from "@/app/hooks/useProducts"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

const categorySchema = z.object({
    categoryName: z.string().min(1, "El nombre de la categoría es requerido"),
    description: z.string().optional(),
})

export type CategorySchema = z.infer<typeof categorySchema>

interface CategoryDialogProps {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    onSubmit: (data: CategorySchema) => void
    editingCategory: Category | null
    isSaving: boolean
    error: Error | null
}

export function CategoryDialog({ isOpen, onOpenChange, onSubmit, editingCategory, isSaving, error }: CategoryDialogProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CategorySchema>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            categoryName: "",
            description: "",
        },
    })

    useEffect(() => {
        if (isOpen) {
            if (editingCategory) {
                reset(editingCategory)
            } else {
                reset({
                    categoryName: "",
                    description: "",
                })
            }
        } else {
            reset()
        }
    }, [isOpen, editingCategory, reset])

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{editingCategory ? "Editar Categoría" : "Nueva Categoría"}</DialogTitle>
                    <DialogDescription>
                        {editingCategory ? "Modifica la información de la categoría" : "Completa los datos de la nueva categoría"}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="categoryName">Nombre de la Categoría</Label>
                        <Input
                            id="categoryName"
                            {...register("categoryName")}
                            placeholder="Ingrese el nombre de la categoría"
                        />
                        {errors.categoryName && <p className="text-red-500 text-xs mt-1">{errors.categoryName.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea
                            id="description"
                            {...register("description")}
                            placeholder="Descripción de la categoría"
                            rows={3}
                        />
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
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
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar Categoría"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
