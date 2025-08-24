"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Printer } from "lucide-react"
import { Invoice } from "@/app/hooks/useInvoices"

interface InvoiceDetailsProps {
    invoice: Invoice
    onBack: () => void
}

export function InvoiceDetails({ invoice, onBack }: InvoiceDetailsProps) {
    const formatPrice = (price: string) => {
        return new Intl.NumberFormat("es-ES", {
            style: "currency",
            currency: "USD",
        }).format(Number.parseFloat(price))
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("es-ES", { year: 'numeric', month: 'long', day: 'numeric' })
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex items-center justify-between mb-8">
                <Button variant="outline" onClick={onBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver a Facturas
                </Button>
                <Button variant="outline" onClick={() => window.print()}>
                    <Printer className="w-4 h-4 mr-2" />
                    Imprimir
                </Button>
            </div>

            <div className="w-full max-w-4xl mx-auto bg-white shadow-lg border border-gray-200">
                <div className="border-b-2 border-gray-800 p-8">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">FACTURA</h1>
                            <div className="text-sm text-gray-600">
                                <p className="font-semibold">No. {invoice.idInvoice}</p>
                                <p>Fecha: {formatDate(invoice.date)}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <h2 className="text-xl font-bold text-gray-800 mb-1">Farmacia La Buena Salud</h2>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p>123 Calle Principal, Ciudad</p>
                                <p>Tel: (123) 456-7890</p>
                                <p>RUC: 123456789-0</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div className="border border-gray-200 p-4 rounded">
                            <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide border-b border-gray-200 pb-2">
                                Facturar a:
                            </h3>
                            <div className="space-y-1 text-sm">
                                <p className="font-semibold">{invoice.customer.customerName}</p>
                                <p className="text-gray-600">{invoice.customer.address}</p>
                                <p className="text-gray-600">ID: {invoice.customer.identification}</p>
                                <p className="text-gray-600">Tel: {invoice.customer.phone}</p>
                            </div>
                        </div>
                        <div className="border border-gray-200 p-4 rounded">
                            <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide border-b border-gray-200 pb-2">
                                Vendido por:
                            </h3>
                            <p className="font-semibold text-sm">{invoice.user.name}</p>
                        </div>
                    </div>

                    <div className="border border-gray-200 rounded overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-800 hover:bg-gray-800">
                                    <TableHead className="text-white font-semibold py-4">Producto</TableHead>
                                    <TableHead className="text-center text-white font-semibold py-4">Cantidad</TableHead>
                                    <TableHead className="text-right text-white font-semibold py-4">Precio Unit.</TableHead>
                                    <TableHead className="text-right text-white font-semibold py-4">Subtotal</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoice.invoiceDetails.map((detail, index) => (
                                    <TableRow key={detail.idDetail} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                                        <TableCell className="py-3 font-medium">{detail.product.productName}</TableCell>
                                        <TableCell className="text-center py-3">{detail.quantity}</TableCell>
                                        <TableCell className="text-right py-3 font-mono">{formatPrice(detail.unitPrice)}</TableCell>
                                        <TableCell className="text-right py-3 font-mono font-semibold">
                                            {formatPrice(detail.subtotal)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex justify-end mt-8">
                        <div className="w-full max-w-sm">
                            <div className="bg-gray-50 border border-gray-200 rounded p-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal:</span>
                                        <span className="font-mono">{formatPrice(invoice.total)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Impuestos:</span>
                                        <span className="font-mono">{formatPrice(invoice.tax)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Descuento:</span>
                                        <span className="font-mono text-red-600">-{formatPrice(invoice.discount)}</span>
                                    </div>
                                    <div className="border-t-2 border-gray-800 pt-3">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-lg text-gray-800">TOTAL:</span>
                                            <span className="font-bold text-xl font-mono text-gray-800">
                                                {formatPrice(String(Number(invoice.total) + Number(invoice.tax) - Number(invoice.discount)))}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="text-xs text-gray-500 text-center space-y-1">
                            <p>Gracias por su compra</p>
                            <p>Esta factura es válida sin firma ni sello</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
