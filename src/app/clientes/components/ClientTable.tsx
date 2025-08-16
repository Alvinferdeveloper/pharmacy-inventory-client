"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Edit, Trash2, Loader2 } from "lucide-react"
import { Customer } from "../types/customer.dto"

interface ClientTableProps {
  clients: Customer[]
  onEdit: (client: Customer) => void
  onDelete: (id: number) => void
  onCreateSale: (client: Customer) => void
  isDeleting: boolean
  deletingClientId: number | null
}

export function ClientTable({ clients, onEdit, onDelete, onCreateSale, isDeleting, deletingClientId }: ClientTableProps) {
  return (
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
          {clients?.map((client) => (
            <TableRow key={client.idCustomer}>
              <TableCell className="font-medium">{client.customerName}</TableCell>
              <TableCell>{client.identification}</TableCell>
              <TableCell>{client.phone}</TableCell>
              <TableCell>{client.address}</TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button
                    size="sm"
                    onClick={() => onCreateSale(client)}
                    className="bg-accent hover:bg-accent/90"
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Crear Venta
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onEdit(client)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onDelete(client.idCustomer)} disabled={isDeleting && deletingClientId === client.idCustomer}>
                    {isDeleting && deletingClientId === client.idCustomer ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
