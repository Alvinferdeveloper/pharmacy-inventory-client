import { useState } from "react"
import { ClientesList } from "./client-list"
import { Customer } from "../types/customer.dto"
import { VentaFlow } from "./venta-flow"

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