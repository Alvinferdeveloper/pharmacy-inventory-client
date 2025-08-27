"use client"

import { useState } from "react"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useClients } from "@/app/hooks/useClients"
import { Customer } from "../types/customer.dto"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAddClient } from "@/app/hooks/useAddClient"
import { useUpdateClient } from "@/app/hooks/useUpdateClient"
import { useToggleCustomerStatus } from "@/app/hooks/useToggleCustomerStatus"
import { useDebounce } from "@/app/hooks/useDebounce"
import { useSearchCustomers } from "@/app/hooks/useSearchCustomers"
import { ClientTable } from "./ClientTable"
import { ClientFormDialog } from "./ClientFormDialog"
import { ClientSchema } from "../types/cliente.schema"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { useCurrentUser } from "@/app/hooks/useCurrentUser"

interface ClientesListProps {
    onCreateVenta: (cliente: Customer) => void
}

export function ClientesList({ onCreateVenta }: ClientesListProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingClient, setEditingClient] = useState<Customer | null>(null)
    const [togglingClientId, setTogglingClientId] = useState<number | null>(null)

    const { data: currentUser } = useCurrentUser()
    const debouncedSearchTerm = useDebounce(searchTerm, 500)

    const { data: allClientes, isLoading: isLoadingAll, error: allClientsError } = useClients()
    const { data: searchedClientes, isLoading: isLoadingSearch, error: searchError } = useSearchCustomers(debouncedSearchTerm)

    const { mutate: addClient, isPending: isAddingClient, error: addClientError, reset: resetAddClientError } = useAddClient()
    const { mutate: updateClient, isPending: isUpdatingClient, error: updateClientError, reset: resetUpdateClientError } = useUpdateClient()
    const { mutate: toggleCustomerStatus, isPending: isTogglingStatus } = useToggleCustomerStatus()

    const clientes = debouncedSearchTerm.length > 2 ? searchedClientes : allClientes
    const isLoading = debouncedSearchTerm.length > 2 ? isLoadingSearch : isLoadingAll
    const error = debouncedSearchTerm.length > 2 ? searchError : allClientsError

    const activeClients = clientes?.filter(c => c.deletedAt === null) || []
    const inactiveClients = clientes?.filter(c => c.deletedAt !== null) || []

    const canManageClients = currentUser?.roles.includes("Administrator") || currentUser?.roles.includes("Salesman");

    const onSubmit = (data: ClientSchema) => {
        if (editingClient) {
            updateClient({ id: editingClient.idCustomer, payload: data }, {
                onSuccess: () => {
                    setIsModalOpen(false)
                    setEditingClient(null)
                }
            })
        } else {
            addClient(data, {
                onSuccess: () => {
                    setIsModalOpen(false)
                },
            })
        }
    }

    const handleEditClick = (cliente: Customer) => {
        setEditingClient(cliente)
        setIsModalOpen(true)
    }

    const handleToggleStatusClick = (clientId: number) => {
        setTogglingClientId(clientId)
        toggleCustomerStatus(clientId, {
            onSettled: () => {
                setTogglingClientId(null)
            }
        })
    }

    const handleModalOpenChange = (isOpen: boolean) => {
        setIsModalOpen(isOpen)
        if (!isOpen) {
            setEditingClient(null)
            resetAddClientError()
            resetUpdateClientError()
        }
    }

    return (
        <div className="p-6">
            <Card className=" bg-card">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-semibold text-foreground">Gestión de Clientes</CardTitle>
                        {canManageClients && (
                            <ClientFormDialog
                                isOpen={isModalOpen}
                                onOpenChange={handleModalOpenChange}
                                onSubmit={onSubmit}
                                editingClient={editingClient}
                                isAdding={isAddingClient}
                                isUpdating={isUpdatingClient}
                                error={addClientError || updateClientError}
                            />
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="active">
                        <TabsList>
                            <TabsTrigger value="active">Activos</TabsTrigger>
                            <TabsTrigger value="inactive">Inactivos</TabsTrigger>
                        </TabsList>
                        <div className="mb-6 mt-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    placeholder="Buscar por nombre o identificación..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <TabsContent value="active">
                            {isLoading && (
                                <div className="flex justify-center items-center py-8">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                </div>
                            )}
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription className="text-red-700">{error.message}</AlertDescription>
                                </Alert>
                            )}
                            {!isLoading && !error && activeClients && (
                                <ClientTable
                                    clients={activeClients}
                                    onEdit={handleEditClick}
                                    onToggleStatus={handleToggleStatusClick}
                                    onCreateSale={onCreateVenta}
                                    isTogglingStatus={isTogglingStatus}
                                    togglingClientId={togglingClientId}
                                    canManageClients={canManageClients}
                                />
                            )}
                            {!isLoading && !error && activeClients?.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                    No se encontraron clientes activos que coincidan con la búsqueda
                                </div>
                            )}
                        </TabsContent>
                        <TabsContent value="inactive">
                            {isLoading && (
                                <div className="flex justify-center items-center py-8">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                </div>
                            )}
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription className="text-red-700">{error.message}</AlertDescription>
                                </Alert>
                            )}
                            {!isLoading && !error && inactiveClients && (
                                <ClientTable
                                    clients={inactiveClients}
                                    onEdit={handleEditClick}
                                    onToggleStatus={handleToggleStatusClick}
                                    onCreateSale={onCreateVenta}
                                    isTogglingStatus={isTogglingStatus}
                                    togglingClientId={togglingClientId}
                                    canManageClients={canManageClients}
                                />
                            )}
                            {!isLoading && !error && inactiveClients?.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                    No se encontraron clientes inactivos que coincidan con la búsqueda
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}
