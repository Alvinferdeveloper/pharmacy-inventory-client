"use client"
import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Pill, Shield, User, Lock } from "lucide-react"
import { useLogin } from "@/app/hooks/useLogin"

export function LoginForm() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const { mutate: login, isPending, error } = useLogin()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        login({ username, password })
    }

    return (
        <Card className="w-full shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="space-y-4 text-center pb-8">
                <div className="mx-auto w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Pill className="w-8 h-8 text-white" />
                </div>

                <div className="space-y-2">
                    <CardTitle className="text-2xl font-serif font-bold text-slate-800">Acceso Seguro al Sistema</CardTitle>
                    <CardDescription className="text-slate-600 text-base">
                        Inicie sesión para gestionar su farmacia de manera eficiente
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="username" className="text-slate-700 font-medium flex items-center gap-2">
                            <User className="w-4 h-4 text-emerald-600" />
                            Nombre de usuario
                        </Label>
                        <Input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Ingrese su nombre de usuario"
                            className="h-12 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 transition-colors"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-slate-700 font-medium flex items-center gap-2">
                            <Lock className="w-4 h-4 text-emerald-600" />
                            Contraseña
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Ingrese su contraseña"
                            className="h-12 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 transition-colors"
                            required
                        />
                    </div>
                    {error && (
                        <Alert className="border-red-200 bg-red-50">
                            <AlertDescription className="text-red-700">{error.message}</AlertDescription>
                        </Alert>
                    )}

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-base rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Iniciando sesión...
                            </>
                        ) : (
                            <>
                                <Shield className="w-4 h-4 mr-2" />
                                Iniciar Sesión
                            </>
                        )}
                    </Button>
                </form>
                <div className="text-center pt-4 border-t border-slate-100">
                    <p className="text-sm text-slate-500">Sistema seguro para la gestión farmacéutica</p>
                </div>
            </CardContent>
        </Card>
    )
}
