"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText, BarChart, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useSalesReportByDateRange } from "@/app/hooks/useSalesReportByDateRange"
import { useSalesByCustomerReport } from "@/app/hooks/useSalesByCustomerReport"
import { useSalesByProductReport } from "@/app/hooks/useSalesByProductReport"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useInventoryReport } from "@/app/hooks/useInventoryReport"
import { useProductsBySupplierReport } from "@/app/hooks/useProductsBySupplierReport"
import { useUsersReport } from "@/app/hooks/useUsersReport"
import { ReportDisplay } from "./components/ReportDisplay"

export default function ReportsPage() {
    const [reportType, setReportType] = useState("")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [customerIdentification, setCustomerIdentification] = useState("")
    const [productCode, setProductCode] = useState("")
    const [supplierId, setSupplierId] = useState("")

    const [triggerReport, setTriggerReport] = useState(false)

    const { data: salesByDateData, isLoading: isLoadingSalesByDate, error: salesByDateError } = useSalesReportByDateRange(
        { startDate, endDate },
        reportType === "sales-by-date" && triggerReport
    )
    const { data: salesByCustomerData, isLoading: isLoadingSalesByCustomer, error: salesByCustomerError } = useSalesByCustomerReport(
        { customerIdentification: customerIdentification },
        reportType === "sales-by-customer" && triggerReport
    )
    const { data: salesByProductData, isLoading: isLoadingSalesByProduct, error: salesByProductError } = useSalesByProductReport(
        { productCode: Number(productCode) },
        reportType === "sales-by-product" && triggerReport
    )
    const { data: inventoryData, isLoading: isLoadingInventory, error: inventoryError } = useInventoryReport(
        reportType === "inventory" && triggerReport
    )
    const { data: productsBySupplierData, isLoading: isLoadingProductsBySupplier, error: productsBySupplierError } = useProductsBySupplierReport(
        { supplierId: Number(supplierId) },
        reportType === "products-by-supplier" && triggerReport
    )
    const { data: usersData, isLoading: isLoadingUsers, error: usersError } = useUsersReport(
        reportType === "users" && triggerReport
    )

    const isLoading = isLoadingSalesByDate || isLoadingSalesByCustomer || isLoadingSalesByProduct || isLoadingInventory || isLoadingProductsBySupplier || isLoadingUsers
    const error = salesByDateError || salesByCustomerError || salesByProductError || inventoryError || productsBySupplierError || usersError
    console.log(inventoryData, "inventoryData")
    useEffect(() => {
        if (triggerReport && !isLoading && !error) {
            let dataToExport: any[] = []
            let filename = "reporte"

            switch (reportType) {
                case "sales-by-date":
                    dataToExport = salesByDateData || []
                    filename = `reporte-ventas-por-fecha-${startDate}-${endDate}`
                    break
                case "sales-by-customer":
                    dataToExport = salesByCustomerData || []
                    filename = `reporte-ventas-por-cliente-${customerIdentification}`
                    break
                case "sales-by-product":
                    dataToExport = salesByProductData || []
                    filename = `reporte-ventas-por-producto-${productCode}`
                    break
                case "inventory":
                    dataToExport = inventoryData || []
                    filename = `reporte-inventario`
                    break
                case "products-by-supplier":
                    dataToExport = productsBySupplierData || []
                    filename = `reporte-productos-por-proveedor-${supplierId}`
                    break
                case "users":
                    dataToExport = usersData || []
                    filename = `reporte-usuarios`
                    break
            }

            if (dataToExport.length > 0) {
                console.log("Report Data:", dataToExport)
                toast.success("Reporte generado exitosamente. Ver en consola.")
            } else if (triggerReport) {
                toast.info("No se encontraron datos para el reporte seleccionado.")
            }
            setTriggerReport(false)
        }
    }, [triggerReport, isLoading, error, reportType, salesByDateData, salesByCustomerData, salesByProductData, inventoryData, productsBySupplierData, usersData, startDate, endDate, customerIdentification, productCode, supplierId])

    const handleGenerateReport = () => {
        setTriggerReport(true)
    }

    const handleExportExcel = async () => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/reports/`
        let filename = "reporte"

        try {
            switch (reportType) {
                case "sales-by-date":
                    if (!startDate || !endDate) {
                        toast.error("Por favor, seleccione un rango de fechas.")
                        return
                    }
                    url += `sales-by-date?startDate=${startDate}&endDate=${endDate}`
                    filename = `reporte-ventas-por-fecha-${startDate}-${endDate}`
                    break
                case "sales-by-customer":
                    if (!customerIdentification) {
                        toast.error("Por favor, seleccione un cliente.")
                        return
                    }
                    url += `sales-by-customer?customerIdentification=${customerIdentification}`
                    filename = `reporte-ventas-por-cliente-${customerIdentification}`
                    break
                case "sales-by-product":
                    if (!productCode) {
                        toast.error("Por favor, seleccione un producto.")
                        return
                    }
                    url += `sales-by-product?productCode=${productCode}`
                    filename = `reporte-ventas-por-producto-${productCode}`
                    break
                case "inventory":
                    url += `inventory`
                    filename = `reporte-inventario`
                    break
                case "products-by-supplier":
                    if (!supplierId) {
                        toast.error("Por favor, seleccione un proveedor.")
                        return
                    }
                    url += `products-by-supplier?supplierId=${supplierId}`
                    filename = `reporte-productos-por-proveedor-${supplierId}`
                    break
                case "users":
                    url += `users`
                    filename = `reporte-usuarios`
                    break
                default:
                    toast.error("Por favor, seleccione un tipo de reporte.")
                    return
            }

            url += reportType === "inventory" || reportType === "users" ? "?export=excel" : "&export=excel"

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || "Error al generar el reporte")
            }

            const blob = await response.blob()
            const downloadUrl = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = downloadUrl
            a.download = `${filename}.xlsx`
            document.body.appendChild(a)
            a.click()
            a.remove()
            window.URL.revokeObjectURL(downloadUrl)
            toast.success("Reporte exportado a Excel exitosamente.")

        } catch (err: any) {
            toast.error(err.message || "Ocurrió un error al exportar el reporte.")
        }
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <BarChart className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Generador de Reportes</h1>
                    <p className="text-muted-foreground">Genera y exporta diversos reportes del sistema</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Seleccionar Reporte</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="reportType">Tipo de Reporte</Label>
                            <Select value={reportType} onValueChange={setReportType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar tipo de reporte" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sales-by-date">Ventas por Rango de Fechas</SelectItem>
                                    <SelectItem value="sales-by-customer">Ventas por Cliente</SelectItem>
                                    <SelectItem value="sales-by-product">Ventas por Producto</SelectItem>
                                    <SelectItem value="inventory">Inventario</SelectItem>
                                    <SelectItem value="products-by-supplier">Productos por Proveedor</SelectItem>
                                    <SelectItem value="users">Usuarios</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {reportType === "sales-by-date" && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="startDate">Fecha Inicio</Label>
                                    <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="endDate">Fecha Fin</Label>
                                    <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                                </div>
                            </div>
                        )}

                        {reportType === "sales-by-customer" && (
                            <div className="space-y-2">
                                <Label htmlFor="customerIdentification">Identificación del Cliente</Label>
                                <Input id="customerIdentification" value={customerIdentification} onChange={(e) => setCustomerIdentification(e.target.value)} placeholder="Ingrese identificacion del Cliente" />
                            </div>
                        )}

                        {reportType === "sales-by-product" && (
                            <div className="space-y-2">
                                <Label htmlFor="productCode">Código del Producto</Label>
                                <Input id="productCode" type="number" value={productCode} onChange={(e) => setProductCode(e.target.value)} placeholder="Ingrese codigo del Producto" />
                            </div>
                        )}

                        {reportType === "products-by-supplier" && (
                            <div className="space-y-2">
                                <Label htmlFor="supplierId">ID Proveedor</Label>
                                <Input id="supplierId" type="number" value={supplierId} onChange={(e) => setSupplierId(e.target.value)} placeholder="Ingrese ID del Proveedor" />
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button onClick={() => handleGenerateReport()} className="flex-1 bg-secondary hover:bg-secondary/90" disabled={isLoading}>
                            {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileText className="h-4 w-4 mr-2" />}
                            Generar Reporte
                        </Button>
                        <Button onClick={handleExportExcel} className="flex-1 bg-green-600 hover:bg-green-700" disabled={isLoading}>
                            <Download className="h-4 w-4 mr-2" />
                            Exportar a Excel
                        </Button>
                    </div>
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error.message}</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>

            {reportType && !isLoading && (
                <ReportDisplay
                    reportType={reportType}
                    data={(() => {
                        switch (reportType) {
                            case "sales-by-date": return salesByDateData;
                            case "sales-by-customer": return salesByCustomerData;
                            case "sales-by-product": return salesByProductData;
                            case "inventory": return inventoryData;
                            case "products-by-supplier": return productsBySupplierData;
                            case "users": return usersData;
                            default: return [];
                        }
                    })()}
                    isLoading={isLoading}
                    error={error}
                />
            )}
        </div>
    )
}
