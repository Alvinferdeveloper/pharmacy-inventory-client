"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Tag, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useCategories } from "@/app/hooks/useCategories"
import { useAddCategory } from "@/app/hooks/useAddCategory"
import { useUpdateCategory } from "@/app/hooks/useUpdateCategory"
import { useDeleteCategory } from "@/app/hooks/useDeleteCategory"
import { Category } from "@/app/hooks/useProducts"
import { CategoriesTable } from "./components/categories-table"
import { CategoryDialog } from "./components/category-dialog"
import { DeleteCategoryConfirmationDialog } from "./components/delete-category-dialog"
import { useDebounce } from "@/app/hooks/useDebounce"
import { CategorySchema } from "./components/category-dialog"

export default function CategoriesPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [deletingCategoryId, setDeletingCategoryId] = useState<number | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const { data: categories, isLoading, error } = useCategories()
    const { mutate: addCategory, isPending: isAdding, error: addError, reset: resetAddError } = useAddCategory()
    const { mutate: updateCategory, isPending: isUpdating, error: updateError, reset: resetUpdateError } = useUpdateCategory()
    const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory()

    const handleAddCategory = (categoryData: CategorySchema) => {
        addCategory(categoryData, {
            onSuccess: () => setIsDialogOpen(false),
        })
    }

    const handleEditCategory = (categoryData: CategorySchema) => {
        if (editingCategory) {
            updateCategory({ id: editingCategory.idCategory, payload: categoryData }, {
                onSuccess: () => {
                    setEditingCategory(null)
                    setIsDialogOpen(false)
                }
            })
        }
    }

    const handleDeleteCategory = (categoryId: number) => {
        setDeletingCategoryId(categoryId)
        setIsDeleteDialogOpen(true)
    }

    const confirmDelete = () => {
        if (deletingCategoryId) {
            deleteCategory(deletingCategoryId, {
                onSuccess: () => {
                    setDeletingCategoryId(null)
                    setIsDeleteDialogOpen(false)
                }
            })
        }
    }

    const openEditDialog = (category: Category) => {
        setEditingCategory(category)
        setIsDialogOpen(true)
    }

    const openAddDialog = () => {
        setEditingCategory(null)
        setIsDialogOpen(true)
    }

    const handleDialogChange = (isOpen: boolean) => {
        setIsDialogOpen(isOpen)
        if (!isOpen) {
            setEditingCategory(null)
            resetAddError()
            resetUpdateError()
        }
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Tag className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Gestión de Categorías</h1>
                        <p className="text-muted-foreground">Administra las categorías de tus productos</p>
                    </div>
                </div>
                <Button onClick={openAddDialog} className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Categoría
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Lista de Categorías</CardTitle>
                    <CardDescription>{categories?.length || 0} categorías registradas en el sistema</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading && (
                        <div className="flex justify-center items-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    )}
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error.message}</AlertDescription>
                        </Alert>
                    )}
                    {categories && (
                        <CategoriesTable
                            categories={categories}
                            onEdit={openEditDialog}
                            onDelete={handleDeleteCategory}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                        />
                    )}

                    {!isLoading && !error && categories?.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            No se encontraron categorías que coincidan con la búsqueda
                        </div>
                    )}
                </CardContent>
            </Card>

            <CategoryDialog
                isOpen={isDialogOpen}
                onOpenChange={handleDialogChange}
                onSubmit={editingCategory ? handleEditCategory : handleAddCategory}
                editingCategory={editingCategory}
                isSaving={isAdding || isUpdating}
                error={addError || updateError}
            />

            <DeleteCategoryConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onOpenChange={() => setIsDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
                isDeleting={isDeleting}
            />
        </div>
    )
}
