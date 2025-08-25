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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User } from "@/app/hooks/useUsers"
import { AddUserPayload } from "@/app/hooks/useAddUser"
import { UpdateUserPayload } from "@/app/hooks/useUpdateUser"
import { useRoles } from "@/app/hooks/useRoles"

const userSchema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    identification: z.string().min(1, "La identificación es requerida").regex(/^\d{3}-\d{6}-\d{4}[A-Z]$/, { message: 'La identificación debe tener el formato XXX-XXXXXX-XXXXX (ej. 888-200402-1000P)' }),
    phone: z.string().min(1, "El teléfono es requerido"),
    email: z.string().email("Debe ser un correo electrónico válido").optional().or(z.literal("")),
    roleId: z.number().min(1, "El rol es requerido"),
})

type UserSchema = z.infer<typeof userSchema>

interface UserFormDialogProps {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    onSubmit: (data: AddUserPayload | UpdateUserPayload) => void
    editingUser: User | null
    isSaving: boolean
    error: Error | null
}

export function UserFormDialog({ isOpen, onOpenChange, onSubmit, editingUser, isSaving, error }: UserFormDialogProps) {
    const { data: roles, isLoading: isLoadingRoles } = useRoles()

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<UserSchema>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: "",
            identification: "",
            phone: "",
            email: "",
            roleId: 1,
        },
    })

    useEffect(() => {
        if (!isOpen) {
            reset({
                name: "",
                identification: "",
                phone: "",
                email: "",
                roleId: 1,
            })
        } else if (editingUser) {
            reset({
                name: editingUser.name,
                identification: editingUser.identification,
                phone: editingUser.phone,
                email: editingUser.email || "",
                roleId: editingUser.role.idRole,
            })
        }
    }, [editingUser, isOpen, reset])

    const handleFormSubmit = (data: UserSchema) => {
        onSubmit(data)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{editingUser ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle>
                    <DialogDescription>
                        {editingUser ? "Modifica la información del usuario" : "Completa los datos del nuevo usuario"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre Completo</Label>
                        <Input id="name" {...register("name")} placeholder="Ingrese el nombre completo" />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="identification">Identificación</Label>
                        <Input id="identification" {...register("identification")} placeholder="Ingrese la identificación" />
                        {errors.identification && <p className="text-red-500 text-xs mt-1">{errors.identification.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input id="phone" {...register("phone")} placeholder="Ingrese el número de teléfono" />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Correo Electrónico</Label>
                        <Input id="email" {...register("email")} placeholder="Ingrese el correo electrónico (opcional)" />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    

                    <div className="space-y-2">
                        <Label htmlFor="roleId">Rol</Label>
                        <Controller
                            name="roleId"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value !== undefined ? String(field.value) : ""}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar rol" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {isLoadingRoles ? (
                                            <SelectItem value="loading">Cargando...</SelectItem>
                                        ) : (
                                            roles?.map((role) => (
                                                <SelectItem key={role.idRole} value={String(role.idRole)}>
                                                    {role.roleName}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.roleId && <p className="text-red-500 text-xs mt-1">{errors.roleId.message}</p>}
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
                            {isSaving ? "Guardando..." : `${editingUser ? "Actualizar" : "Crear"} Usuario`}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
