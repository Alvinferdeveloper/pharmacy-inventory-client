"use client"

import { useState } from "react"
import { Search, Plus, ShoppingCart, Edit, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useClients } from "@/app/hooks/useClients"
import { Customer } from "../types/customer.dto"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ClientesListProps {
  onCreateVenta: (cliente: Customer) => void
}

export function ClientesList({ onCreateVenta }: ClientesListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newCliente, setNewCliente] = useState({
    customerName: "",
    identification: "",
    phone: "",
    address: "",
  })

  const { data: clientes, isLoading, error, refetch } = useClients()

  const filteredClientes = clientes?.filter(
    (cliente) =>
      cliente.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || cliente.identification.includes(searchTerm),
  )

  const handleAddCliente = () => {
    console.log("Adding new client:", newCliente)
    setIsModalOpen(false)
    refetch()
  }

  return (
    <div className="p-6">
      <Card className=" bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-semibold text-foreground">Gestión de Clientes</CardTitle>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Cliente
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Registrar Nuevo Cliente</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="nombre">Nombre Completo</Label>
                        <Input
                        id="nombre"
                        value={newCliente.customerName}
                        onChange={(e) => setNewCliente({ ...newCliente, customerName: e.target.value })}
                        placeholder="Ingrese el nombre completo"
                        />
                    </div>
                    <div>
                        <Label htmlFor="identificacion">Identificación</Label>
                        <Input
                        id="identificacion"
                        value={newCliente.identification}
                        onChange={(e) => setNewCliente({ ...newCliente, identification: e.target.value })}
                      placeholder="Número de identificación"
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                      id="telefono"
                      value={newCliente.phone}
                      onChange={(e) => setNewCliente({ ...newCliente, phone: e.target.value })}
                      placeholder="Número de teléfono"
                    />
                  </div>
                  <div>
                    <Label htmlFor="direccion">Dirección</Label>
                    <Input
                      id="direccion"
                      value={newCliente.address}
                      onChange={(e) => setNewCliente({ ...newCliente, address: e.target.value })}
                      placeholder="Dirección completa"
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleAddCliente} className="flex-1 bg-primary hover:bg-primary/90">
                      Guardar Cliente
                    </Button>
                    <Button variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
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

          {isLoading && (
            <div className="flex justify-center items-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {error && (
            <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">{error.message}</AlertDescription>
            </Alert>
          )}

          {!isLoading && !error && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Identificación</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Dirección</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClientes?.map((cliente) => (
                    <TableRow key={cliente.idCustomer}>
                      <TableCell className="font-medium">{cliente.customerName}</TableCell>
                      <TableCell>{cliente.identification}</TableCell>
                      <TableCell>{cliente.phone}</TableCell>
                      <TableCell>{cliente.address}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            onClick={() => onCreateVenta(cliente)}
                            className="bg-accent hover:bg-accent/90"
                          >
                            <ShoppingCart className="w-4 h-4 mr-1" />
                            Crear Venta
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {!isLoading && !error && filteredClientes?.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron clientes que coincidan con la búsqueda
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
