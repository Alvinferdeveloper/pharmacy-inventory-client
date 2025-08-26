"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts"
import { useSalesByCategory } from "@/app/hooks/useSalesByCategory"
import { Loader2 } from "lucide-react"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF1919"];

export function SalesByCategoryChart() {
    const { data: salesByCategory, isLoading, error } = useSalesByCategory()

    return (
        <Card>
            <CardHeader>
                <CardTitle>Ventas por Categoría</CardTitle>
                <CardDescription>Distribución de las ventas por categoría de producto</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading && <div className="flex justify-center items-center h-[300px]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}
                {error && <div className="flex justify-center items-center h-[300px]">Error al cargar los datos del gráfico.</div>}
                {!isLoading && !error && salesByCategory && (
                    <ChartContainer config={{}}>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={salesByCategory}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="total"
                                    nameKey="categoryName"
                                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                                        const RADIAN = Math.PI / 180;
                                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                        const y = cy + radius * Math.sin(-midAngle * RADIAN);

                                        return (
                                            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                                                {`${(percent * 100).toFixed(0)}%`}
                                            </text>
                                        );
                                    }}
                                >
                                    {salesByCategory.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <ChartTooltip
                                    content={<ChartTooltipContent />}
                                    formatter={(value: number, name: string) => [
                                        `${value.toLocaleString("es-ES", { style: "currency", currency: "USD" })}`,
                                        name,
                                    ]}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}
