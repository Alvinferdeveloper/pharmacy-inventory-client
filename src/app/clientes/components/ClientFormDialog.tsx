"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { clientSchema, ClientSchema } from "../types/cliente.schema"
import { Loader2, Plus } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Customer } from "../types/customer.dto"
import { useEffect } from "react"

interface ClientFormDialogProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onSubmit: (data: ClientSchema) => void
  editingClient: Customer | null
  isAdding: boolean
  isUpdating: boolean
  error: Error | null
}

export function ClientFormDialog({ isOpen, onOpenChange, onSubmit, editingClient, isAdding, isUpdating, error }: ClientFormDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ClientSchema>({
    resolver: zodResolver(clientSchema),
  })

  useEffect(() => {
    if (editingClient) {
      reset(editingClient)
    } else {
      reset({
        customerName: "",
        identification: "",
        phone: "",
        address: "",
      })
    }
  }, [editingClient, reset])

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Cliente
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editingClient ? "Editar Cliente" : "Registrar Nuevo Cliente"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="customerName">Nombre Completo</Label>
            <Input
              id="customerName"
              {...register("customerName")}
              placeholder="Ingrese el nombre completo"
            />
            {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName.message}</p>}
          </div>
          <div>
            <Label htmlFor="identification">Identificación</Label>
            <Input
              id="identification"
              {...register("identification")}
              placeholder="000-000000-0000A"
            />
            {errors.identification && <p className="text-red-500 text-xs mt-1">{errors.identification.message}</p>}
          </div>
          <div>
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              {...register("phone")}
              placeholder="Número de teléfono de 8 dígitos"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>
          <div>
            <Label htmlFor="address">Dirección</Label>
            <Input
              id="address"
              {...register("address")}
              placeholder="Dirección completa"
            />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}
          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isAdding || isUpdating} className="flex-1 bg-primary hover:bg-primary/90">
              {isAdding || isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar Cliente"}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
