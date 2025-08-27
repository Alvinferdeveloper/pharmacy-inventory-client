"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useCurrentUser } from "@/app/hooks/useCurrentUser"
import { useUpdateUser } from "@/app/hooks/useUpdateUser"
import ChangePasswordPage from "@/app/change-password/page"

const profileSchema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    phone: z.string().min(1, "El teléfono es requerido"),
    email: z.string().email("Debe ser un correo electrónico válido").optional().or(z.literal("")),
});

type ProfileSchema = z.infer<typeof profileSchema>

export default function ProfilePage() {
    const { data: currentUser, isLoading: isLoadingUser, error: userError } = useCurrentUser()
    const { mutate: updateUser, isPending: isUpdating, error: updateError, reset: resetUpdateError } = useUpdateUser()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProfileSchema>({
        resolver: zodResolver(profileSchema),
    })

    useEffect(() => {
        if (currentUser) {
            reset({
                name: currentUser.name,
                phone: currentUser.phone,
                email: currentUser.email || "",
            })
        }
    }, [currentUser, reset])

    const onSubmit = (data: ProfileSchema) => {
        if (currentUser) {
            updateUser({ id: currentUser.idUser, payload: data }, {
                onSuccess: () => {
                    resetUpdateError()
                }
            })
        }
    }

    if (isLoadingUser) {
        return <div className="flex justify-center items-center h-screen">Cargando perfil...</div>
    }

    if (userError) {
        return <div className="flex justify-center items-center h-screen">Error al cargar el perfil: {userError.message}</div>
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl">
            <h1 className="text-3xl font-bold text-foreground mb-8">Mi Perfil</h1>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Información Personal</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre Completo</Label>
                            <Input id="name" {...register("name")} />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Teléfono</Label>
                            <Input id="phone" {...register("phone")} />
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo Electrónico</Label>
                            <Input id="email" {...register("email")} />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                        </div>

                        {updateError && (
                            <Alert variant="destructive">
                                <AlertDescription>{updateError.message}</AlertDescription>
                            </Alert>
                        )}

                        <Button type="submit" disabled={isUpdating}>
                            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Actualizar Información"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Cambiar Contraseña</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChangePasswordPage />
                </CardContent>
            </Card>
        </div>
    )
}
