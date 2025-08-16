"use client"

import { useState } from "react"
import { ArrowLeft, Search, Plus, Minus, ShoppingCart, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface Medicamento {
  id: number
  nombre: string
  precio: number
  stock: number
  categoria: string
  descripcion: string
}

interface ItemVenta {
  medicamento: Medicamento
  cantidad: number
}

interface VentaFlowProps {
  cliente: any
  onBack: () => void
}

export function VentaFlow({ cliente, onBack }: VentaFlowProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [carrito, setCarrito] = useState<ItemVenta[]>([])
  const [ventaGuardada, setVentaGuardada] = useState(false)

  // Mock data de medicamentos
  const medicamentos: Medicamento[] = [
    {
      id: 1,
      nombre: "Acetaminofén 500mg",
      precio: 2500,
      stock: 50,
      categoria: "Analgésicos",
      descripcion: "Tabletas para dolor y fiebre",
    },
    {
      id: 2,
      nombre: "Ibuprofeno 400mg",
      precio: 3200,
      stock: 30,
      categoria: "Antiinflamatorios",
      descripcion: "Cápsulas antiinflamatorias",
    },
    {
      id: 3,
      nombre: "Amoxicilina 500mg",
      precio: 8500,
      stock: 25,
      categoria: "Antibióticos",
      descripcion: "Cápsulas antibióticas",
    },
    {
      id: 4,
      nombre: "Loratadina 10mg",
      precio: 4200,
      stock: 40,
      categoria: "Antihistamínicos",
      descripcion: "Tabletas para alergias",
    },
    {
      id: 5,
      nombre: "Omeprazol 20mg",
      precio: 6800,
      stock: 35,
      categoria: "Gastroprotectores",
      descripcion: "Cápsulas para acidez",
    },
  ]

  const filteredMedicamentos = medicamentos.filter(
    (med) =>
      med.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.categoria.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const agregarAlCarrito = (medicamento: Medicamento) => {
    const itemExistente = carrito.find((item) => item.medicamento.id === medicamento.id)

    if (itemExistente) {
      if (itemExistente.cantidad < medicamento.stock) {
        setCarrito(
          carrito.map((item) =>
            item.medicamento.id === medicamento.id ? { ...item, cantidad: item.cantidad + 1 } : item,
          ),
        )
      }
    } else {
      setCarrito([...carrito, { medicamento, cantidad: 1 }])
    }
  }

  const actualizarCantidad = (medicamentoId: number, nuevaCantidad: number) => {
    if (nuevaCantidad === 0) {
      setCarrito(carrito.filter((item) => item.medicamento.id !== medicamentoId))
    } else {
      const medicamento = medicamentos.find((m) => m.id === medicamentoId)
      if (medicamento && nuevaCantidad <= medicamento.stock) {
        setCarrito(
          carrito.map((item) => (item.medicamento.id === medicamentoId ? { ...item, cantidad: nuevaCantidad } : item)),
        )
      }
    }
  }

  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + item.medicamento.precio * item.cantidad, 0)
  }

  const guardarVenta = () => {
    // Aquí se guardaría la venta en la base de datos
    console.log("Guardando venta:", {
      cliente,
      items: carrito,
      total: calcularTotal(),
      fecha: new Date(),
    })
    setVentaGuardada(true)
    setTimeout(() => {
      onBack()
    }, 2000)
  }

  if (ventaGuardada) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">¡Venta Guardada!</h3>
            <p className="text-muted-foreground mb-4">La venta para {cliente.nombre} se ha registrado exitosamente.</p>
            <p className="text-sm text-muted-foreground">Regresando a la lista de clientes...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button variant="outline" onClick={onBack} className="mb-4 bg-transparent">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Clientes
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Nueva Venta</h1>
            <p className="text-muted-foreground">
              Cliente: <span className="font-medium">{cliente.nombre}</span> - {cliente.identificacion}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            <Badge variant="secondary">{carrito.length} items</Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Medicamentos */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Medicamentos Disponibles</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar medicamentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredMedicamentos.map((medicamento) => {
                  const itemEnCarrito = carrito.find((item) => item.medicamento.id === medicamento.id)
                  const cantidadEnCarrito = itemEnCarrito?.cantidad || 0

                  return (
                    <div key={medicamento.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{medicamento.nombre}</h4>
                        <p className="text-sm text-muted-foreground">{medicamento.descripcion}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge variant="outline">{medicamento.categoria}</Badge>
                          <span className="text-sm">Stock: {medicamento.stock}</span>
                          <span className="font-medium">${medicamento.precio.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {cantidadEnCarrito > 0 ? (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => actualizarCantidad(medicamento.id, cantidadEnCarrito - 1)}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-8 text-center">{cantidadEnCarrito}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => actualizarCantidad(medicamento.id, cantidadEnCarrito + 1)}
                              disabled={cantidadEnCarrito >= medicamento.stock}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => agregarAlCarrito(medicamento)}
                            disabled={medicamento.stock === 0}
                            className="bg-accent hover:bg-accent/90"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Agregar
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Carrito de Compras */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Resumen de Venta</CardTitle>
            </CardHeader>
            <CardContent>
              {carrito.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No hay medicamentos seleccionados</p>
              ) : (
                <div className="space-y-4">
                  {carrito.map((item) => (
                    <div key={item.medicamento.id} className="flex justify-between items-start">
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">{item.medicamento.nombre}</h5>
                        <p className="text-xs text-muted-foreground">
                          ${item.medicamento.precio.toLocaleString()} x {item.cantidad}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${(item.medicamento.precio * item.cantidad).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}

                  <Separator />

                  <div className="flex justify-between items-center font-semibold text-lg">
                    <span>Total:</span>
                    <span>${calcularTotal().toLocaleString()}</span>
                  </div>

                  <Button
                    onClick={guardarVenta}
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={carrito.length === 0}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Guardar Compra
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}