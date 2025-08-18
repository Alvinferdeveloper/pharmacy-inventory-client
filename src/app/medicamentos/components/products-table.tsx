"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit, Trash2, MoreHorizontal, Search, AlertTriangle } from "lucide-react"

import { Product } from "@/app/hooks/useProducts"

interface ProductsTableProps {
    products: Product[]
    onEdit: (product: Product) => void
    onDelete: (id: number) => void
}

export function ProductsTable({ products, onEdit, onDelete }: ProductsTableProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 6

    const filteredProducts = products.filter(
        (product) =>
            product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.categoryName.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage)

    const getStockStatus = (stock: number) => {
        if (stock <= 1) return { label: "Crítico", variant: "destructive" } as const
        if (stock <= 5) return { label: "Bajo", variant: "secondary" } as const
        return { label: "Normal", variant: "default" } as const
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("es-ES", {
            style: "currency",
            currency: "USD",
        }).format(Number.parseFloat(price.toString()))
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
                    placeholder="Buscar productos por nombre, código o categoría..."
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
                            <TableHead className="font-semibold">Código</TableHead>
                            <TableHead className="font-semibold">Producto</TableHead>
                            <TableHead className="font-semibold">Categoría</TableHead>
                            <TableHead className="font-semibold">Stock</TableHead>
                            <TableHead className="font-semibold">Precio Compra</TableHead>
                            <TableHead className="font-semibold">Precio Venta</TableHead>
                            <TableHead className="font-semibold">Vencimiento</TableHead>
                            <TableHead className="font-semibold">Proveedor</TableHead>
                            <TableHead className="text-right font-semibold">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedProducts.map((product) => {
                            const stockStatus = getStockStatus(product.stock)
                            return (
                                <TableRow key={product.idProduct} className="hover:bg-muted/30 transition-colors">
                                    <TableCell className="font-mono text-sm">{product.code}</TableCell>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{product.productName}</div>
                                            <div className="text-sm text-muted-foreground">{product.description}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{product.category.categoryName}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{product.stock}</span>
                                            <Badge variant={stockStatus.variant} className="text-xs">
                                                {stockStatus.label}
                                            </Badge>
                                            {product.stock <= 1 && <AlertTriangle className="h-4 w-4 text-destructive" />}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{formatPrice(Number(product.purchasePrice))}</TableCell>
                                    <TableCell className="font-medium text-accent">{formatPrice(Number(product.sellingPrice))}</TableCell>
                                    <TableCell className="text-sm">{formatDate(product.expirationDate)}</TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            <div className="font-medium">{product.supplier.supplierName}</div>
                                            <div className="text-muted-foreground">{product.supplier.phone}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => onEdit(product)} className="group">
                                                    <Edit className="mr-2 h-4 w-4 group-hover:text-accent-foreground" />
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onDelete(product.idProduct)} className="text-destructive group">
                                                    <Trash2 className="mr-2 h-4 w-4 group-hover:text-destructive" />
                                                    Eliminar
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredProducts.length)} de{" "}
                        {filteredProducts.length} productos
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
