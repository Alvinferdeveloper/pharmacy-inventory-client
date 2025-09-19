"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Edit, Loader2, User, Phone, Home, UserX, Power } from "lucide-react"
import { Customer } from "../types/customer.dto"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ClientTableProps {
  clients: Customer[]
  onEdit: (client: Customer) => void
  onToggleStatus: (id: number) => void
  onCreateSale: (client: Customer) => void
  isTogglingStatus: boolean
  togglingClientId: number | null
  canManageClients: boolean | undefined
}

export function ClientTable({ clients, onEdit, onToggleStatus, onCreateSale, isTogglingStatus, togglingClientId, canManageClients }: ClientTableProps) {
  return (
    <TooltipProvider>
      <div className="rounded-md border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Cliente</TableHead>
              <TableHead className="font-semibold">Contacto</TableHead>
              <TableHead className="font-semibold">Estado</TableHead>
              {canManageClients && <TableHead className="text-right font-semibold">Acciones</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients?.map((client) => {
              const isActive = client.deletedAt === null
              return (
                <TableRow key={client.idCustomer} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{client.customerName}</div>
                        <Badge variant="outline">{client.identification}</Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{client.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{client.address}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={isActive ? "default" : "destructive"}>
                      {isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  {canManageClients && (
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              onClick={() => onCreateSale(client)}
                              className="bg-primary hover:bg-primary/90"
                              disabled={!isActive}
                            >
                              <ShoppingCart className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Crear Venta</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => onEdit(client)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Editar Cliente</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant={isActive ? "destructive" : "default"}
                              onClick={() => onToggleStatus(client.idCustomer)}
                              disabled={isTogglingStatus && togglingClientId === client.idCustomer}
                            >
                              {isTogglingStatus && togglingClientId === client.idCustomer ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : isActive ? (
                                <UserX className="h-4 w-4" />
                              ) : (
                                <Power className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {isActive ? <p>Desactivar Cliente</p> : <p>Activar Cliente</p>}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  )
}
