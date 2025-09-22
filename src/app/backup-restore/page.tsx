"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Download, Upload, AlertTriangle, Database } from "lucide-react"
import { useBackupDatabase } from "@/app/hooks/useBackupDatabase"
import { useRestoreDatabase } from "@/app/hooks/useRestoreDatabase"
import { withAuth } from "@/app/components/withAuth"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { toast } from "sonner"

function BackupRestorePage() {
    const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [backupDescription, setBackupDescription] = useState("");

    const { mutate: backupDatabase, isPending: isBackingUp } = useBackupDatabase()
    const { mutate: restoreDatabase, isPending: isRestoring, error: restoreError, reset: resetRestoreError } = useRestoreDatabase()

    const handleBackup = (description?: string) => {
        backupDatabase({ description }, {
            onSuccess: (response) => {
                const header = response.headers['content-disposition'];
                const fileName = header ? header.split('filename=')[1].replace(/"/g, '') : `backup-${new Date().toISOString()}.sql`;
                const blob = new Blob([response.data], { type: 'application/sql' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                a.remove();
                toast.success("Respaldo descargado exitosamente!")
            },
            onError: (error) => {
                toast.error(error.message || "Error al crear el respaldo.")
            }
        })
    }

    const confirmRestore = () => {
        if (selectedFile) {
            restoreDatabase(selectedFile, {
                onSuccess: () => {
                    setIsRestoreDialogOpen(false)
                    setSelectedFile(null)
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
                    <CardContent className="p-6 flex flex-col items-center justify-center h-full space-y-4">
                        <Input
                            type="text"
                            placeholder="Descripción (opcional)"
                            value={backupDescription}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBackupDescription(e.target.value)}
                            className="w-full max-w-xs"
                        />
                        <Button
                            onClick={() => handleBackup(backupDescription)}
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
                        <div className="space-y-4 flex flex-col items-center">
                            <div className="w-full p-4 border-2 border-dashed rounded-lg text-center">
                                <input
                                    type="file"
                                    accept=".sql"
                                    onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                                    className="text-sm text-grey-500 
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-violet-50 file:text-violet-700
                                    hover:file:bg-violet-100"
                                />
                                {selectedFile && <p className="mt-2 text-sm text-muted-foreground">Archivo seleccionado: {selectedFile.name}</p>}
                            </div>
                            <Button
                                onClick={() => setIsRestoreDialogOpen(true)}
                                disabled={!selectedFile || isRestoring}
                                className="w-full max-w-xs bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
                            >
                                {isRestoring ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Upload className="w-5 h-5 mr-2" />}
                                {isRestoring ? "Restaurando..." : "Restaurar desde Archivo"}
                            </Button>
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
                            ¿Está absolutamente seguro de que desea restaurar la base de datos desde el archivo <strong>{selectedFile?.name}</strong>? Esta acción es **irreversible** y sobreescribirá todos los datos actuales.
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
