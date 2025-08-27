"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ListOrdered } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useInventoryMovements } from "@/app/hooks/useInventoryMovements"
import { InventoryMovementsTable } from "./components/InventoryMovementsTable"
import { withAuth } from "@/app/components/withAuth"
import { Input } from "@/components/ui/input"

function InventoryMovementsPage() {
    const [productCode, setProductCode] = useState<string>("")
    const [startDate, setStartDate] = useState<string>("")
    const [endDate, setEndDate] = useState<string>("")

    const { data: movements, isLoading, error } = useInventoryMovements(productCode, startDate, endDate)

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <ListOrdered className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Movimientos de Inventario</h1>
                    <p className="text-muted-foreground">Rastrea todos los movimientos de stock.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Filtros</CardTitle>
                    <div className="flex gap-4">
                        <Input
                            type="text"
                            placeholder="Código del Producto"
                            value={productCode}
                            onChange={(e) => setProductCode(e.target.value)}
                        />
                        <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                        <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
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
                    {movements && <InventoryMovementsTable movements={movements} />}
                </CardContent>
            </Card>
        </div>
    )
}

export default withAuth(InventoryMovementsPage, ["Administrator", "Consultant"]);
