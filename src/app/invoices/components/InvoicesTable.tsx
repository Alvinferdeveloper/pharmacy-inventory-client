import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Trash2, Search } from "lucide-react"
import { Invoice } from "@/app/hooks/useInvoices"

interface InvoicesTableProps {
    invoices: Invoice[]
    onView: (id: number) => void
    onDelete: (id: number) => void
    canManageInvoices: boolean | undefined
}

export function InvoicesTable({ invoices, onView, onDelete, canManageInvoices }: InvoicesTableProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const filteredInvoices = invoices.filter(
        (invoice) =>
            String(invoice.idInvoice).includes(searchTerm) ||
            invoice.customer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + itemsPerPage)

    const formatPrice = (price: string) => {
        return new Intl.NumberFormat("es-ES", {
            style: "currency",
            currency: "USD",
        }).format(Number.parseFloat(price))
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("es-ES")
    }

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                    placeholder="Buscar por ID de factura, cliente o vendedor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Table */}
            <div className="rounded-lg border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="font-semibold">ID Factura</TableHead>
                            <TableHead className="font-semibold">Fecha</TableHead>
                            <TableHead className="font-semibold">Cliente</TableHead>
                            <TableHead className="font-semibold">Vendedor</TableHead>
                            <TableHead className="font-semibold">Total</TableHead>
                            {canManageInvoices && <TableHead className="text-right font-semibold">Acciones</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedInvoices.map((invoice) => (
                            <TableRow key={invoice.idInvoice} className="hover:bg-muted/30 transition-colors">
                                <TableCell className="font-mono text-sm">{invoice.idInvoice}</TableCell>
                                <TableCell>{formatDate(invoice.date)}</TableCell>
                                <TableCell>{invoice.customer.customerName}</TableCell>
                                <TableCell>{invoice.user.name}</TableCell>
                                <TableCell className="font-medium">{formatPrice(invoice.total)}</TableCell>
                                {canManageInvoices && (
                                    <TableCell className="text-right">
                                        <div className="flex gap-2 justify-end">
                                            <Button size="sm" variant="outline" onClick={() => onView(invoice.idInvoice)}>
                                                <Eye className="h-4 w-4 mr-1" />
                                                Ver
                                            </Button>
                                            <Button size="sm" variant="destructive" onClick={() => onDelete(invoice.idInvoice)}>
                                                <Trash2 className="h-4 w-4 mr-1" />
                                                Eliminar
                                            </Button>
                                        </div>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, paginatedInvoices.length)} de{" "}
                        {filteredInvoices.length} facturas
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Anterior
                        </Button>
                        <span className="text-sm">
                            Página {currentPage} de {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Siguiente
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
