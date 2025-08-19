"use client"

import { useState } from "react"
import { SuppliersTable } from "./components/suppliers-table"
import { SupplierDialog } from "./components/supplier-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Truck, Loader2 } from "lucide-react"
import { useSuppliers } from "@/app/hooks/useSuppliers"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAddSupplier, AddSupplierPayload } from "@/app/hooks/useAddSupplier"
import { useUpdateSupplier, UpdateSupplierPayload } from "@/app/hooks/useUpdateSupplier"
import { useDeleteSupplier } from "@/app/hooks/useDeleteSupplier"
import { DeleteSupplierConfirmationDialog } from "./components/delete-supplier-confirmation-dialog"
import { Supplier } from "@/app/proveedores/types/supplier.dto"

export default function SuppliersPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
    const [deletingSupplierId, setDeletingSupplierId] = useState<number | null>(null)

    const { data: suppliers, isLoading, error } = useSuppliers()
    const { mutate: addSupplier, isPending: isAdding, error: addError, reset: resetAddError } = useAddSupplier()
    const { mutate: updateSupplier, isPending: isUpdating, error: updateError, reset: resetUpdateError } = useUpdateSupplier()
    const { mutate: deleteSupplier, isPending: isDeleting } = useDeleteSupplier()

    const handleAddSupplier = (supplierData: AddSupplierPayload | UpdateSupplierPayload) => {
        addSupplier(supplierData as AddSupplierPayload, {
            onSuccess: () => setIsDialogOpen(false),
        })
    }

    const handleEditSupplier = (supplierData: AddSupplierPayload | UpdateSupplierPayload) => {
        if (editingSupplier) {
            updateSupplier({ id: editingSupplier.idSupplier, payload: supplierData as UpdateSupplierPayload }, {
                onSuccess: () => {
                    setEditingSupplier(null)
                    setIsDialogOpen(false)
                }
            })
        }
    }

    const handleDeleteSupplier = (supplierId: number) => {
        setDeletingSupplierId(supplierId)
        setIsDeleteDialogOpen(true)
    }

    const confirmDelete = () => {
        if (deletingSupplierId) {
            deleteSupplier(deletingSupplierId, {
                onSuccess: () => {
                    setDeletingSupplierId(null)
                    setIsDeleteDialogOpen(false)
                }
            })
        }
    }

    const openEditDialog = (supplier: Supplier) => {
        setEditingSupplier(supplier)
        setIsDialogOpen(true)
    }

    const openAddDialog = () => {
        setEditingSupplier(null)
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
                        <Truck className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Gestión de Proveedores</h1>
                        <p className="text-muted-foreground">Administra tus proveedores</p>
                    </div>
                </div>
                <Button onClick={openAddDialog} className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Proveedor
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Lista de Proveedores</CardTitle>
                    <CardDescription>{suppliers?.length || 0} proveedores registrados en el sistema</CardDescription>
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
                    {suppliers && <SuppliersTable suppliers={suppliers} onEdit={openEditDialog} onDelete={handleDeleteSupplier} />}
                </CardContent>
            </Card>

            <SupplierDialog
                isOpen={isDialogOpen}
                onOpenChange={handleDialogChange}
                onSave={editingSupplier ? handleEditSupplier : handleAddSupplier}
                supplier={editingSupplier}
                isSaving={isAdding || isUpdating}
                error={addError || updateError}
            />

            <DeleteSupplierConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={confirmDelete}
                isDeleting={isDeleting}
            />
        </div>
    )
}
