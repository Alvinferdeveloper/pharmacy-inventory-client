"use client"

import { useState } from "react"
import { ArrowLeft, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useProducts, Product } from "@/app/hooks/useProducts"
import { useSaveSale } from "@/app/hooks/useSaveSale"
import { Customer } from "../types/customer.dto"
import { ProductList } from "./ProductList"
import { ShoppingCart as ShoppingCartComponent } from "./ShoppingCart"
import { SaleConfirmation } from "./SaleConfirmation"

export interface CartItem {
  product: Product
  quantity: number
}

interface VentaFlowProps {
  customer: Customer
  onBack: () => void
}

export function VentaFlow({ customer, onBack }: VentaFlowProps) {
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
    return <SaleConfirmation customerName={customer.customerName} />
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
        <ProductList
          products={filteredProducts}
          cart={cart}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onAddToCart={addToCart}
          onUpdateQuantity={updateQuantity}
        />
        <ShoppingCartComponent
          cart={cart}
          onSaveSale={handleSaveSale}
          isSaving={isSaving}
          saveError={saveError}
          calculateTotal={calculateTotal}
        />
      </div>
    </div>
  )
}