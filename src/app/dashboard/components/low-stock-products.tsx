"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Loader2 } from "lucide-react"
import { useDashboardStats } from "@/app/hooks/useDashboard"

export function LowStockProducts() {
  const { data: stats, isLoading, error } = useDashboardStats()

  const getStockBadgeVariant = (stock: number) => {
    if (stock <= 1) return "destructive"
    if (stock <= 3) return "secondary"
    return "default"
  }

  const getStockStatus = (stock: number) => {
    if (stock <= 1) return "Crítico"
    if (stock <= 3) return "Bajo"
    return "Normal"
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Productos con Bajo Stock
          </CardTitle>
          <CardDescription>Cargando...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-card animate-pulse">
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-muted rounded"></div>
                  <div className="h-3 w-1/2 bg-muted rounded"></div>
                </div>
                <div className="h-6 w-16 bg-muted rounded-full"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return <div>Error al cargar los productos con bajo stock.</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          Productos con Bajo Stock
        </CardTitle>
        <CardDescription>Productos que requieren reposición urgente</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {stats?.lowStockProducts.map((product) => (
            <div key={product.idProduct} className="flex items-center justify-between p-3 rounded-lg border bg-card">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-sm">{product.productName}</p>
                  <Badge variant={getStockBadgeVariant(product.stock)}>
                    {product.stock} {product.stock === 1 ? "unidad" : "unidades"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{product.category?.categoryName || 'N/A'}</span>
                  <span>${product.sellingPrice.toLocaleString("es-ES", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="mt-1">
                  <Badge
                    variant={getStockBadgeVariant(product.stock)}
                  >
                    Stock {getStockStatus(product.stock)}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
