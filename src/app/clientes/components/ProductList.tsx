"use client"

import { Search, Plus, Minus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Product } from "@/app/hooks/useProducts"
import { CartItem } from "./venta-flow"

interface ProductListProps {
  products: Product[]
  cart: CartItem[]
  searchTerm: string
  onSearchTermChange: (term: string) => void
  onAddToCart: (product: Product) => void
  onUpdateQuantity: (productId: number, newQuantity: number) => void
}

export function ProductList({ products, cart, searchTerm, onSearchTermChange, onAddToCart, onUpdateQuantity }: ProductListProps) {
  return (
    <div className="lg:col-span-2">
      <Card>
        <CardHeader>
          <CardTitle>Medicamentos Disponibles</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar medicamentos..."
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {products.map((product) => {
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
                          onClick={() => onUpdateQuantity(product.idProduct, quantityInCart - 1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center">{quantityInCart}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onUpdateQuantity(product.idProduct, quantityInCart + 1)}
                          disabled={quantityInCart >= product.stock}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => onAddToCart(product)}
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
  )
}
