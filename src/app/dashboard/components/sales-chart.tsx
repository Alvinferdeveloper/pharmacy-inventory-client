"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useSalesOverTime } from "@/app/hooks/useDashboard"
import { Loader2 } from "lucide-react"

const chartConfig = {
    total: {
        label: "Ventas",
        color: "hsl(var(--chart-1))",
    },
}

export function SalesChart() {
    const [period, setPeriod] = useState<"day" | "week" | "month">("day")
    const { data: salesData, isLoading, error } = useSalesOverTime(period)

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        switch (period) {
            case "day":
                return date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit" })
            case "week":
                return `Sem ${date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit" })}`
            case "month":
                return date.toLocaleDateString("es-ES", { month: "short", year: "2-digit" })
            default:
                return dateString
        }
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Ventas a lo Largo del Tiempo</CardTitle>
                        <CardDescription>
                            Evolución de las ventas por {period === "day" ? "día" : period === "week" ? "semana" : "mes"}
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button variant={period === "day" ? "default" : "outline"} size="sm" onClick={() => setPeriod("day")}>
                            Día
                        </Button>
                        <Button variant={period === "week" ? "default" : "outline"} size="sm" onClick={() => setPeriod("week")}>
                            Semana
                        </Button>
                        <Button variant={period === "month" ? "default" : "outline"} size="sm" onClick={() => setPeriod("month")}>
                            Mes
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading && <div className="flex justify-center items-center h-[300px]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}
                {error && <div className="flex justify-center items-center h-[300px]">Error al cargar los datos del gráfico.</div>}
                {!isLoading && !error && salesData && (
                    <ChartContainer config={chartConfig}>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={salesData}>
                                <XAxis dataKey="date" tickFormatter={formatDate} axisLine={false} tickLine={false} />
                                <YAxis tickFormatter={(value) => `${value.toLocaleString("es-ES")}`} axisLine={false} tickLine={false} />
                                <ChartTooltip
                                    content={<ChartTooltipContent />}
                                    formatter={(value: number) => [
                                        `${value.toLocaleString("es-ES", { minimumFractionDigits: 2 })}`,
                                        "Ventas",
                                    ]}
                                    labelFormatter={(label) => `Fecha: ${formatDate(label)}`}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="total"
                                    stroke="var(--color-chart-1)"
                                    strokeWidth={2}
                                    dot={{ fill: "var(--color-chart-1)", strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 6, stroke: "var(--color-chart-1)", strokeWidth: 2 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}
