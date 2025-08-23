"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy } from "lucide-react"
import { toast } from "sonner"

interface TemporaryPasswordDialogProps {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    temporaryPassword: string | null
}

export function TemporaryPasswordDialog({ isOpen, onOpenChange, temporaryPassword }: TemporaryPasswordDialogProps) {
    const handleCopy = () => {
        if (temporaryPassword) {
            navigator.clipboard.writeText(temporaryPassword)
            toast.success("Contraseña copiada al portapapeles")
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Contraseña Temporal</DialogTitle>
                    <DialogDescription>
                        La contraseña temporal para el nuevo usuario ha sido generada. Por favor, cópiela y entréguesela al usuario.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="temp-password">Contraseña</Label>
                        <div className="flex items-center space-x-2">
                            <Input
                                id="temp-password"
                                type="text"
                                readOnly
                                value={temporaryPassword || ""}
                            />
                            <Button type="button" size="sm" onClick={handleCopy}>
                                <Copy className="h-4 w-4" />
                                <span className="sr-only">Copiar</span>
                            </Button>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" onClick={() => onOpenChange(false)}>Cerrar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
