"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { InventoryMovement } from "@/app/hooks/useInventoryMovements"
import { Button } from "@/components/ui/button"

interface InventoryMovementsTableProps {
    movements: InventoryMovement[]
}

export function InventoryMovementsTable({ movements }: InventoryMovementsTableProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const totalPages = Math.ceil(movements.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedMovements = movements.slice(startIndex, startIndex + itemsPerPage)

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' })
    }

    return (
        <div className="space-y-4">
            <div className="rounded-lg border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="font-semibold">Producto</TableHead>
                            <TableHead className="font-semibold">Tipo</TableHead>
                            <TableHead className="font-semibold">Cantidad</TableHead>
                            <TableHead className="font-semibold">Fecha</TableHead>
                            <TableHead className="font-semibold">Razón</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedMovements.map((movement) => (
                            <TableRow key={movement.idMovement} className="hover:bg-muted/30 transition-colors">
                                <TableCell>{movement.product.productName}</TableCell>
                                <TableCell>
                                    <Badge variant={movement.movementType === 'in' ? 'default' : 'secondary'}>
                                        {movement.movementType === 'in' ? 'Entrada' : 'Salida'}
                                    </Badge>
                                </TableCell>
                                <TableCell>{movement.quantity}</TableCell>
                                <TableCell>{formatDate(movement.date)}</TableCell>
                                <TableCell>{movement.reason}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, movements.length)} de{" "}
                        {movements.length} movimientos
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
