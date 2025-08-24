import { DashboardStats } from "./dashboard-stats"
import { SalesChart } from "./sales-chart"
import { BestSellingProducts } from "./best-selling-products"
import { LowStockProducts } from "./low-stock-products"
import { RecentInvoices } from "./recent-invoices"

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-foreground">Dashboard de Ventas</h1>
                    <div className="text-sm text-muted-foreground">Actualizado: {new Date().toLocaleDateString("es-ES")}</div>
                </div>
                <DashboardStats />
                <SalesChart />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <BestSellingProducts />
                    <LowStockProducts />
                </div>
                <RecentInvoices />
            </div>
        </div>
    )
}