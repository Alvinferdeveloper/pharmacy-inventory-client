"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit, Trash2, MoreHorizontal, Search } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { Category } from "@/app/hooks/useProducts"

interface CategoriesTableProps {
    categories: Category[]
    onEdit: (category: Category) => void
    onDelete: (id: number) => void
    searchTerm: string
    setSearchTerm: (term: string) => void
    canManageCategories: boolean | undefined
}

export function CategoriesTable({ categories, onEdit, onDelete, searchTerm, setSearchTerm, canManageCategories }: CategoriesTableProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 6

    const filteredCategories = categories.filter(
        (category) =>
            category.categoryName.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedCategories = filteredCategories.slice(startIndex, startIndex + itemsPerPage)

    return (
        <TooltipProvider>
            <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Buscar categorías por nombre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* Table */}
                <div className="rounded-lg border bg-card shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead className="font-semibold">Nombre</TableHead>
                                <TableHead className="font-semibold">Descripción</TableHead>
                                {canManageCategories && <TableHead className="text-right font-semibold">Acciones</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedCategories.map((category) => (
                                <TableRow key={category.idCategory} className="hover:bg-muted/30 transition-colors">
                                    <TableCell className="font-medium">{category.categoryName}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{category.description}</TableCell>
                                    {canManageCategories && (
                                        <TableCell className="text-right">
                                            <div className="flex gap-2 justify-end">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button size="sm" variant="outline" onClick={() => onEdit(category)}>
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Editar Categoría</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button size="sm" variant="destructive" onClick={() => onDelete(category.idCategory)}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Eliminar Categoría</p>
                                                    </TooltipContent>
                                                </Tooltip>
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
                            Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredCategories.length)} de{" "}
                            {filteredCategories.length} categorías
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
        </TooltipProvider>
    )
}
