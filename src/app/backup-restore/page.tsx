"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Download, Upload, AlertTriangle, Database, CheckCircle } from "lucide-react"
import { useBackupDatabase } from "@/app/hooks/useBackupDatabase"
import { useRestoreDatabase } from "@/app/hooks/useRestoreDatabase"
import { useGetBackups } from "@/app/hooks/useGetBackups"
import { withAuth } from "@/app/components/withAuth"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { toast } from "sonner"

function BackupRestorePage() {
    const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false)
    const [selectedBackup, setSelectedBackup] = useState<string | null>(null)

    const { mutate: backupDatabase, isPending: isBackingUp } = useBackupDatabase()
    const { mutate: restoreDatabase, isPending: isRestoring, error: restoreError, reset: resetRestoreError } = useRestoreDatabase()
    const { data: backups, isLoading: isLoadingBackups, error: backupsError } = useGetBackups()

    const handleBackup = () => {
        backupDatabase(undefined, {
            onSuccess: () => {
                toast.success("Respaldo creado exitosamente!")
            },
            onError: (error) => {
                toast.error(error.message || "Error al crear el respaldo.")
            }
        })
    }

    const handleRestoreClick = (fileName: string) => {
        setSelectedBackup(fileName)
        setIsRestoreDialogOpen(true)
    }

    const confirmRestore = () => {
        if (selectedBackup) {
            restoreDatabase(selectedBackup, {
                onSuccess: () => {
                    setIsRestoreDialogOpen(false)
                    setSelectedBackup(null)
                    toast.success("Base de datos restaurada exitosamente!")
                },
                onError: (error) => {
                    toast.error(error.message || "Error al restaurar la base de datos.")
                }
            })
        }
    }

    const handleRestoreDialogChange = (isOpen: boolean) => {
        setIsRestoreDialogOpen(isOpen)
        if (!isOpen) {
            setSelectedBackup(null)
            resetRestoreError()
        }
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <Database className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Respaldo y Restauración</h1>
                    <p className="text-muted-foreground">Gestiona las copias de seguridad de tu base de datos.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="shadow-lg">
                    <CardHeader className="bg-gray-50 border-b">
                        <CardTitle className="text-xl font-semibold text-gray-800">Crear Respaldo</CardTitle>
                        <CardDescription>Genera una nueva copia de seguridad de la base de datos en este momento.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                        <Button
                            onClick={handleBackup}
                            disabled={isBackingUp}
                            className="w-full max-w-xs bg-green-600 hover:bg-green-700 text-white py-3 text-lg rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
                        >
                            {isBackingUp ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Download className="w-5 h-5 mr-2" />}
                            {isBackingUp ? "Creando Respaldo..." : "Crear Respaldo Ahora"}
                        </Button>
                    </CardContent>
                </Card>

                <Card className="shadow-lg">
                    <CardHeader className="bg-gray-50 border-b">
                        <CardTitle className="text-xl font-semibold text-gray-800">Restaurar Base de Datos</CardTitle>
                        <CardDescription>Selecciona un respaldo existente para restaurar la base de datos.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <Alert variant="destructive" className="mb-6 border-red-300 bg-red-50 text-red-800">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            <AlertTitle className="font-semibold text-red-800">Advertencia Crítica</AlertTitle>
                            <AlertDescription className="text-red-700">
                                Restaurar la base de datos sobreescribirá **permanentemente** todos los datos actuales. Esta acción no se puede deshacer. Procede con extrema precaución.
                            </AlertDescription>
                        </Alert>
                        <div className="space-y-4">
                            {isLoadingBackups && (
                                <div className="flex justify-center items-center py-4">
                                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                    <span className="ml-2 text-muted-foreground">Cargando respaldos...</span>
                                </div>
                            )}
                            {backupsError && (
                                <Alert variant="destructive">
                                    <AlertDescription>{backupsError.message || "Error al cargar los respaldos."}</AlertDescription>
                                </Alert>
                            )}
                            {!isLoadingBackups && backups && backups.length > 0 ? (
                                <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                    {backups.map((backup) => (
                                        <li key={backup} className="flex items-center justify-between p-3 border border-gray-200 rounded-md bg-white shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <Database className="h-5 w-5 text-gray-600" />
                                                <span className="font-medium text-gray-700">{backup}</span>
                                            </div>
                                            <Button
                                                size="sm"
                                                onClick={() => handleRestoreClick(backup)}
                                                disabled={isRestoring}
                                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 transition-all duration-200 transform hover:scale-105"
                                            >
                                                {isRestoring && selectedBackup === backup ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                                                {isRestoring && selectedBackup === backup ? "Restaurando..." : "Restaurar"}
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            ) : !isLoadingBackups && !backupsError && (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Database className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                    <p className="text-lg">No hay respaldos disponibles.</p>
                                    <p className="text-sm">Crea uno para empezar a gestionar tus copias de seguridad.</p>
                                </div>
                            )}
                            {restoreError && (
                                <Alert variant="destructive" className="mt-4">
                                    <AlertDescription>{restoreError.message || "Ocurrió un error al restaurar la base de datos."}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={isRestoreDialogOpen} onOpenChange={handleRestoreDialogChange}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Confirmar Restauración</DialogTitle>
                        <DialogDescription className="text-base">
                            ¿Está absolutamente seguro de que desea restaurar la base de datos desde el archivo <strong>{selectedBackup}</strong>? Esta acción es **irreversible** y sobreescribirá todos los datos actuales.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-end gap-3 mt-6">
                        <Button variant="outline" onClick={() => handleRestoreDialogChange(false)} className="px-4 py-2 rounded-md">Cancelar</Button>
                        <Button variant="destructive" onClick={confirmRestore} disabled={isRestoring} className="px-4 py-2 rounded-md">
                            {isRestoring ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <AlertTriangle className="w-4 h-4 mr-2" />}
                            {isRestoring ? "Restaurando..." : "Confirmar Restauración"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default withAuth(BackupRestorePage, ["Administrator"]);
