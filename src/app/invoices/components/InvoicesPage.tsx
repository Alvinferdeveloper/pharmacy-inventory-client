import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useInvoices } from "@/app/hooks/useInvoices"
import { useDeleteInvoice } from "@/app/hooks/useDeleteInvoice"
import { InvoicesTable } from "./InvoicesTable"
import { InvoiceDetails } from "./InvoiceDetails"
import { useInvoice } from "@/app/hooks/useInvoice"
import { DeleteInvoiceConfirmationDialog } from "./DeleteInvoiceConfirmationDialog"

import { useCurrentUser } from "@/app/hooks/useCurrentUser"

export default function InvoicesPage() {
    const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [deletingInvoiceId, setDeletingInvoiceId] = useState<number | null>(null)
    const [searchDate, setSearchDate] = useState<string>("")

    const { data: currentUser } = useCurrentUser()
    const { data: invoices, isLoading, error } = useInvoices(searchDate)
    const { data: selectedInvoice, isLoading: isLoadingInvoice } = useInvoice(selectedInvoiceId!)
    const { mutate: deleteInvoice, isPending: isDeleting } = useDeleteInvoice()

    const handleDeleteInvoice = (invoiceId: number) => {
        setDeletingInvoiceId(invoiceId)
        setIsDeleteDialogOpen(true)
    }

    const confirmDelete = () => {
        if (deletingInvoiceId) {
            deleteInvoice(deletingInvoiceId, {
                onSuccess: () => {
                    setDeletingInvoiceId(null)
                    setIsDeleteDialogOpen(false)
                }
            })
        }
    }

    const handleViewDetails = (invoiceId: number) => {
        setSelectedInvoiceId(invoiceId)
    }

    const handleBackToInvoices = () => {
        setSelectedInvoiceId(null)
    }

    const canManageInvoices = currentUser?.roles.includes("Administrator") || currentUser?.roles.includes("Salesman");

    if (selectedInvoiceId && selectedInvoice) {
        return <InvoiceDetails invoice={selectedInvoice} onBack={handleBackToInvoices} />
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Gestión de Facturas</h1>
                        <p className="text-muted-foreground">Consulta y administra las facturas del sistema</p>
                    </div>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Lista de Facturas</CardTitle>
                    <CardDescription>{invoices?.length || 0} facturas registradas en el sistema</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <input
                            type="date"
                            value={searchDate}
                            onChange={(e) => setSearchDate(e.target.value)}
                            className="p-2 border rounded-md"
                        />
                    </div>
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
                    {invoices && <InvoicesTable invoices={invoices} onView={handleViewDetails} onDelete={handleDeleteInvoice} canManageInvoices={canManageInvoices} />}
                </CardContent>
            </Card>

            <DeleteInvoiceConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={confirmDelete}
                isDeleting={isDeleting}
            />
        </div>
    )
}