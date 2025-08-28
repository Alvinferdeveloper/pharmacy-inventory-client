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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const itemInCart = cart.find((item) => item.product.idProduct === product.idProduct)
              const quantityInCart = itemInCart?.quantity || 0

              return (
                <Card key={product.idProduct} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="flex-grow p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{product.category.categoryName}</Badge>
                      <Badge variant={product.stock > 0 ? "secondary" : "destructive"}>
                        {product.stock > 0 ? `Stock: ${product.stock}` : "Agotado"}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-1 truncate">{product.productName}</h3>
                    <p className="text-sm text-muted-foreground h-10">{product.description}</p>
                  </div>
                  <div className="p-4 bg-muted/40">
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-bold text-primary">${parseFloat(product.sellingPrice).toLocaleString()}</p>
                      <div className="flex items-center gap-2">
                        {quantityInCart > 0 ? (
                          <div className="flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => onUpdateQuantity(product.idProduct, quantityInCart - 1)}
                              className="rounded-full"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-8 text-center font-bold text-lg">{quantityInCart}</span>
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => onUpdateQuantity(product.idProduct, quantityInCart + 1)}
                              disabled={quantityInCart >= product.stock}
                              className="rounded-full"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => onAddToCart(product)}
                            disabled={product.stock === 0}
                            className="bg-primary hover:bg-primary/90"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Agregar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
