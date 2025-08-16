"use client"

import { useState } from "react"
import { ArrowLeft, Search, Plus, Minus, ShoppingCart, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useProducts, Product } from "@/app/hooks/useProducts"
import { useSaveSale } from "@/app/hooks/useSaveSale"
import { Customer } from "../types/customer.dto"

interface CartItem {
  product: Product
  quantity: number
}

interface SaleFlowProps {
  customer: Customer
  onBack: () => void
}

export function VentaFlow({ customer, onBack }: SaleFlowProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [saleSaved, setSaleSaved] = useState(false)
  const { data: products, isLoading, error } = useProducts()
  const { mutate: saveSaleMutation, isPending: isSaving, error: saveError } = useSaveSale()

  const filteredProducts = products?.filter(
    (product) =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.categoryName.toLowerCase().includes(searchTerm.toLowerCase()),
  ) || []

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.product.idProduct === product.idProduct)

    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(
          cart.map((item) =>
            item.product.idProduct === product.idProduct ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        )
      }
    } else {
      setCart([...cart, { product, quantity: 1 }])
    }
  }

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      setCart(cart.filter((item) => item.product.idProduct !== productId))
    } else {
      const product = products?.find((p) => p.idProduct === productId)
      if (product && newQuantity <= product.stock) {
        setCart(
          cart.map((item) => (item.product.idProduct === productId ? { ...item, quantity: newQuantity } : item)),
        )
      }
    }
  }

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + parseFloat(item.product.sellingPrice) * item.quantity, 0)
  }

  const handleSaveSale = () => {
    const saleData = {
      customerId: customer.idCustomer,
      products: cart.map(item => ({
        productId: item.product.idProduct,
        quantity: item.quantity
      }))
    }

    saveSaleMutation(saleData, {
      onSuccess: () => {
        setSaleSaved(true)
        setTimeout(() => {
          onBack()
        }, 2000)
      }
    })
  }

  if (isLoading) {
    return <div>Cargando productos...</div>
  }

  if (error) {
    return <div>Error al cargar los productos: {error.message}</div>
  }

  if (saleSaved) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">¡Venta Guardada!</h3>
            <p className="text-muted-foreground mb-4">La venta para {customer.customerName} se ha registrado exitosamente.</p>
            <p className="text-sm text-muted-foreground">Regresando a la lista de clientes...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button variant="outline" onClick={onBack} className="mb-4 bg-transparent">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Clientes
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Nueva Venta</h1>
            <p className="text-muted-foreground">
              Cliente: <span className="font-medium">{customer.customerName}</span> - {customer.identification}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            <Badge variant="secondary">{cart.length} items</Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Medicamentos Disponibles</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar medicamentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredProducts.map((product) => {
                  const itemInCart = cart.find((item) => item.product.idProduct === product.idProduct)
                  const quantityInCart = itemInCart?.quantity || 0

                  return (
                    <div key={product.idProduct} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{product.productName}</h4>
                        <p className="text-sm text-muted-foreground">{product.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge variant="outline">{product.category.categoryName}</Badge>
                          <span className="text-sm">Stock: {product.stock}</span>
                          <span className="font-medium">${parseFloat(product.sellingPrice).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {quantityInCart > 0 ? (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(product.idProduct, quantityInCart - 1)}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-8 text-center">{quantityInCart}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(product.idProduct, quantityInCart + 1)}
                              disabled={quantityInCart >= product.stock}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => addToCart(product)}
                            disabled={product.stock === 0}
                            className="bg-accent hover:bg-accent/90"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Agregar
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shopping Cart */}
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
                    onClick={handleSaveSale}
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
      </div>
    </div>
  )
}