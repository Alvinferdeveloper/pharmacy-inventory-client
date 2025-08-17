"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Check, Loader2 } from "lucide-react"
import { CartItem } from "./venta-flow"

interface ShoppingCartProps {
  cart: CartItem[]
  onSaveSale: () => void
  isSaving: boolean
  saveError: Error | null
  calculateTotal: () => number
}

export function ShoppingCart({ cart, onSaveSale, isSaving, saveError, calculateTotal }: ShoppingCartProps) {
  return (
    <div>
      <Card className="sticky top-6">
        <CardHeader>
          <CardTitle>Resumen de Venta</CardTitle>
        </CardHeader>
        <CardContent>
          {cart.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No hay medicamentos seleccionados</p>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.product.idProduct} className="flex justify-between items-start">
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">{item.product.productName}</h5>
                    <p className="text-xs text-muted-foreground">
                      ${parseFloat(item.product.sellingPrice).toLocaleString()} x {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${(parseFloat(item.product.sellingPrice) * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}

              <Separator />

              <div className="flex justify-between items-center font-semibold text-lg">
                <span>Total:</span>
                <span>${calculateTotal().toLocaleString()}</span>
              </div>

              <Button
                onClick={onSaveSale}
                className="w-full bg-primary hover:bg-primary/90"
                disabled={cart.length === 0 || isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Guardar Compra
                  </>
                )}
              </Button>
              {saveError && <p className="text-red-500 text-sm mt-2">Error al guardar la venta: {saveError.message}</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
