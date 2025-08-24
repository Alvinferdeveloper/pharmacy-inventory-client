import { useState } from "react"
import { Product } from "@/app/hooks/useProducts"
import { useProducts } from "@/app/hooks/useProducts"
import { useAddProduct, AddProductPayload } from "@/app/hooks/useAddProduct"
import { useUpdateProduct, UpdateProductPayload } from "@/app/hooks/useUpdateProduct"
import { useDeleteProduct } from "@/app/hooks/useDeleteProduct"
import { DeleteProductConfirmationDialog } from "./DeleteProductConfirmationDialog"
import { ProductDialog } from "./product-dialog"
import { ProductsTable } from "./products-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Package, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ProductsPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [deletingProductId, setDeletingProductId] = useState<number | null>(null)

    const { data: products, isLoading, error } = useProducts()
    const { mutate: addProduct, isPending: isAdding, error: addError, reset: resetAddError } = useAddProduct()
    const { mutate: updateProduct, isPending: isUpdating, error: updateError, reset: resetUpdateError } = useUpdateProduct()
    const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct()

    const handleAddProduct = (productData: AddProductPayload | UpdateProductPayload) => {
        addProduct(productData as AddProductPayload, {
            onSuccess: () => setIsDialogOpen(false),
        })
    }

    const handleEditProduct = (productData: AddProductPayload | UpdateProductPayload) => {
        if (editingProduct) {
            updateProduct({ id: editingProduct.idProduct, payload: productData as UpdateProductPayload }, {
                onSuccess: () => {
                    setEditingProduct(null)
                    setIsDialogOpen(false)
                }
            })
        }
    }

    const handleDeleteProduct = (productId: number) => {
        setDeletingProductId(productId)
        setIsDeleteDialogOpen(true)
    }

    const confirmDelete = () => {
        if (deletingProductId) {
            deleteProduct(deletingProductId, {
                onSuccess: () => {
                    setDeletingProductId(null)
                    setIsDeleteDialogOpen(false)
                }
            })
        }
    }

    const openEditDialog = (product: Product) => {
        setEditingProduct(product)
        setIsDialogOpen(true)
    }

    const openAddDialog = () => {
        setEditingProduct(null)
        setIsDialogOpen(true)
    }

    const handleDialogChange = (isOpen: boolean) => {
        setIsDialogOpen(isOpen)
        if (!isOpen) {
            resetAddError()
            resetUpdateError()
        }
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Gestión de Productos</h1>
                        <p className="text-muted-foreground">Administra tu inventario de productos</p>
                    </div>
                </div>
                <Button onClick={openAddDialog} className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Producto
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Lista de Productos</CardTitle>
                    <CardDescription>{products?.length || 0} productos registrados en el sistema</CardDescription>
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
                    {products && <ProductsTable products={products} onEdit={openEditDialog} onDelete={handleDeleteProduct} />}
                </CardContent>
            </Card>

            <ProductDialog
                isOpen={isDialogOpen}
                onOpenChange={handleDialogChange}
                onSave={editingProduct ? handleEditProduct : handleAddProduct}
                product={editingProduct}
                isSaving={isAdding || isUpdating}
                error={addError || updateError}
            />

            <DeleteProductConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onOpenChange={() => setIsDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
                isDeleting={isDeleting}
            />
        </div>
    )
}