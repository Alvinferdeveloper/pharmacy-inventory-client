"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Check } from "lucide-react"

interface SaleConfirmationProps {
  customerName: string
}

export function SaleConfirmation({ customerName }: SaleConfirmationProps) {
  return (
    <div className="p-6 flex items-center justify-center min-h-[400px]">
      <Card className="w-full max-w-md text-center">
        <CardContent className="pt-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">¡Venta Guardada!</h3>
          <p className="text-muted-foreground mb-4">La venta para {customerName} se ha registrado exitosamente.</p>
          <p className="text-sm text-muted-foreground">Regresando a la lista de clientes...</p>
        </CardContent>
      </Card>
    </div>
  )
}
