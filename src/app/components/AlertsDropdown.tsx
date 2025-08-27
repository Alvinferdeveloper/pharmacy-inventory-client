"use client"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Bell, AlertTriangle } from "lucide-react"
import { useLowStockAlerts } from "@/app/hooks/useLowStockAlerts"
import { useExpiringProductsAlerts } from "@/app/hooks/useExpiringProductsAlerts"
import { Badge } from "@/components/ui/badge"

export function AlertsDropdown() {
    const { data: lowStockAlerts, isLoading: isLoadingLowStock, error: errorLowStock } = useLowStockAlerts()
    const { data: expiringProductsAlerts, isLoading: isLoadingExpiring, error: errorExpiring } = useExpiringProductsAlerts()

    const totalAlerts = (lowStockAlerts?.length || 0) + (expiringProductsAlerts?.length || 0)

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                    <Bell className="h-4 w-4" />
                    {totalAlerts > 0 && (
                        <Badge variant="destructive" className="absolute -top-2 -right-2 h-6 w-6 rounded-full flex items-center justify-center">
                            {totalAlerts}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Alertas</h4>
                        <p className="text-sm text-muted-foreground">
                            Notificaciones importantes del sistema.
                        </p>
                    </div>
                    <div className="grid gap-2 max-h-64 overflow-y-auto">
                        <h5 className="font-semibold text-sm">Stock Bajo</h5>
                        {isLoadingLowStock && <p>Cargando alertas...</p>}
                        {errorLowStock && <p className="text-red-500">Error al cargar alertas.</p>}
                        {lowStockAlerts && lowStockAlerts.length > 0 ? (
                            lowStockAlerts.map((product) => (
                                <div key={product.idProduct} className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                                    <div className="grid gap-1">
                                        <p className="text-sm font-medium leading-none">
                                            {product.productName}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Stock actual: {product.stock}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">No hay alertas de stock bajo.</p>
                        )}
                    </div>
                    <div className="grid gap-2 max-h-64 overflow-y-auto">
                        <h5 className="font-semibold text-sm">Próximos a Vencer</h5>
                        {isLoadingExpiring && <p>Cargando alertas...</p>}
                        {errorExpiring && <p className="text-red-500">Error al cargar alertas.</p>}
                        {expiringProductsAlerts && expiringProductsAlerts.length > 0 ? (
                            expiringProductsAlerts.map((product) => (
                                <div key={product.idProduct} className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-amber-500" />
                                    <div className="grid gap-1">
                                        <p className="text-sm font-medium leading-none">
                                            {product.productName}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Vence el: {new Date(product.expirationDate).toLocaleDateString('es-ES')}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">No hay productos próximos a vencer.</p>
                        )}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

