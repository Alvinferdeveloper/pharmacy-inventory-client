"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertTriangle } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useChangePassword } from "@/app/hooks/useChangePassword"
import { useCurrentUser } from "@/app/hooks/useCurrentUser"
import { useRouter } from "next/navigation"

const changePasswordSchema = z.object({
    oldPassword: z.string().min(1, "La contraseña actual es requerida"),
    newPassword: z.string().min(8, "La nueva contraseña debe tener al menos 8 caracteres").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,50}$/, "La nueva contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial"),
    confirmNewPassword: z.string().min(1, "Confirme la nueva contraseña"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Las nuevas contraseñas no coinciden",
    path: ["confirmNewPassword"],
});

type ChangePasswordSchema = z.infer<typeof changePasswordSchema>

export default function ChangePasswordPage() {
    const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser()
    const { mutate: changePassword, isPending, error, reset: resetError } = useChangePassword()
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ChangePasswordSchema>({
        resolver: zodResolver(changePasswordSchema),
    })

    const onSubmit = (data: ChangePasswordSchema) => {
        if (currentUser) {
            changePassword({ id: currentUser.idUser, payload: data }, {
                onSuccess: () => {
                    reset()
                    resetError()
                    router.push("/dashboard") // Redirect to dashboard after successful password change
                }
            })
        }
    }

    if (isLoadingUser) {
        return <div className="flex justify-center items-center h-screen">Cargando usuario...</div>
    }

    console.log(currentUser)
    if (currentUser && !currentUser.mustChangePassword) {
        router.push("/dashboard")
        return null
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Cambiar Contraseña</CardTitle>
                </CardHeader>
                <CardContent>
                    {currentUser?.mustChangePassword && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertTitle className="flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Advertencia</AlertTitle>
                            <AlertDescription>
                                Su contraseña es temporal. Debe cambiarla para poder acceder a otras secciones del sistema.
                            </AlertDescription>
                        </Alert>
                    )}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="oldPassword">Contraseña Actual</Label>
                            <Input id="oldPassword" type="password" {...register("oldPassword")}/>
                            {errors.oldPassword && <p className="text-red-500 text-xs mt-1">{errors.oldPassword.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">Nueva Contraseña</Label>
                            <Input id="newPassword" type="password" {...register("newPassword")}/>
                            {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmNewPassword">Confirmar Nueva Contraseña</Label>
                            <Input id="confirmNewPassword" type="password" {...register("confirmNewPassword")}/>
                            {errors.confirmNewPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmNewPassword.message}</p>}
                        </div>

                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error.message}</AlertDescription>
                            </Alert>
                        )}

                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Cambiar Contraseña"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}