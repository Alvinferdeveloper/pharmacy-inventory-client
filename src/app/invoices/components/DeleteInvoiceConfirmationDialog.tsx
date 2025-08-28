"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, AlertTriangle } from "lucide-react"

interface DeleteInvoiceConfirmationDialogProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onConfirm: () => void
  isDeleting: boolean
}

export function DeleteInvoiceConfirmationDialog({ isOpen, onOpenChange, onConfirm, isDeleting }: DeleteInvoiceConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="text-destructive" />
            Confirmar Anulación de Factura
          </DialogTitle>
          <DialogDescription>
            ¿Está seguro de que desea anular esta factura? Esta acción es irreversible y afectará los reportes de ventas y el inventario.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Anular Factura"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
