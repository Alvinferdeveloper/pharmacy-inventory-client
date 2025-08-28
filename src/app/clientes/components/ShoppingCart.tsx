"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Check, Loader2, ShoppingCart as ShoppingCartIcon } from "lucide-react"
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
        <CardContent className="p-0">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <ShoppingCartIcon className="w-16 h-16 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">Tu carrito está vacío</p>
              <p className="text-sm text-muted-foreground/80">Agrega productos para iniciar una venta.</p>
            </div>
          ) : (
            <div>
              <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                {cart.map((item, index) => (
                  <div key={item.product.idProduct}>
                    <div className="flex justify-between items-start">
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
                    {index < cart.length - 1 && <Separator className="my-4" />}
                  </div>
                ))}
              </div>
              <div className="p-6 bg-muted/40 border-t">
                <div className="flex justify-between items-center font-semibold text-lg mb-4">
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
                {saveError && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertDescription>{saveError.message}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
