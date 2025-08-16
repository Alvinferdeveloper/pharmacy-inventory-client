"use client"

import { useState } from "react"
import { ClientesList } from "./components/client-list"
import { VentaFlow } from "./components/venta-flow"
import { Customer } from "./types/customer.dto"

export default function ClientesPage() {
  const [vistaActual, setVistaActual] = useState<"clientes" | "venta">("clientes")
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Customer | null>(null)

  const handleCreateVenta = (cliente: Customer) => {
    setClienteSeleccionado(cliente)
    setVistaActual("venta")
  }

  const handleBackToClientes = () => {
    setVistaActual("clientes")
    setClienteSeleccionado(null)
  }

  return (
    <div className="flex h-screen bg-background">
      <main className="flex-1 overflow-auto">
        {vistaActual === "clientes" ? (
          <ClientesList onCreateVenta={handleCreateVenta} />
        ) : (
          clienteSeleccionado && <VentaFlow customer={clienteSeleccionado} onBack={handleBackToClientes} />
        )}
      </main>
    </div>
  )
}

