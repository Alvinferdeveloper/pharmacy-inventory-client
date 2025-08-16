"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, User, Loader2 } from "lucide-react"
import { useDashboardStats } from "@/app/hooks/useDashboard"

export function RecentInvoices() {
    const { data: stats, isLoading, error } = useDashboardStats()

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case "Pagada":
                return "default"
            case "Pendiente":
                return "secondary"
            case "Cancelada":
                return "destructive"
            default:
                return "outline"
        }
    }

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Facturas Recientes
                    </CardTitle>
                    <CardDescription>Cargando...</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-lg border bg-card animate-pulse">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-muted"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 w-32 bg-muted rounded"></div>
                                        <div className="h-3 w-48 bg-muted rounded"></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-6 w-24 bg-muted rounded"></div>
                                    <div className="h-3 w-32 bg-muted rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (error) {
        return <div>Error al cargar las facturas recientes.</div>
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Facturas Recientes
                </CardTitle>
                <CardDescription>Últimas 5 facturas generadas</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {stats?.recentInvoices.map((invoice) => (
                        <div key={invoice.idInvoice} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                                    <FileText className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="font-medium text-sm">Factura #{invoice.idInvoice.toString().padStart(4, "0")}</p>
                                        <Badge variant={getStatusBadgeVariant(invoice.status)}>{invoice.status}</Badge>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <User className="h-3 w-3" />
                                        <span>{invoice.customer.customerName}</span>
                                        <span>•</span>
                                        <span>{formatDate(invoice.date)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-lg">
                                    ${invoice.total.toLocaleString("es-ES", { minimumFractionDigits: 2 })}
                                </p>
                                <p className="text-xs text-muted-foreground">{invoice.customer.identification}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
