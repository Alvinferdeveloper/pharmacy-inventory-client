import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, AlertTriangle } from "lucide-react"

interface DeleteUserConfirmationDialogProps {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    onConfirm: () => void
    isDeleting: boolean
}

export function DeleteUserConfirmationDialog({ isOpen, onOpenChange, onConfirm, isDeleting }: DeleteUserConfirmationDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Confirmar Eliminación de Usuario</DialogTitle>
                    <DialogDescription className="text-base">
                        ¿Está absolutamente seguro de que desea eliminar este usuario? Esta acción es **irreversible** y el usuario no podrá ser reactivado.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex justify-end gap-3 mt-6">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="px-4 py-2 rounded-md">Cancelar</Button>
                    <Button variant="destructive" onClick={onConfirm} disabled={isDeleting} className="px-4 py-2 rounded-md">
                        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <AlertTriangle className="w-4 h-4 mr-2" />}
                        {isDeleting ? "Eliminando..." : "Confirmar Eliminación"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}