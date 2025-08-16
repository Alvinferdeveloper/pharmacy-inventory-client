"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, Pill, UserCheck, FolderOpen, Truck, Menu, X } from "lucide-react"
import { useCurrentUser } from "@/app/hooks/useCurrentUser"
import { useUser } from "@/app/context/UserContext"

const USER_ROLES = {
    Administrator: ["dashboard", "clientes", "medicamentos", "usuarios", "categorias", "proveedores"],
    Salesman: ["clientes", "medicamentos", "categorias"],
    Consultant: ["dashboard", "clientes", "medicamentos"],
}

const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, key: "dashboard" },
    { name: "Clientes", href: "/clientes", icon: Users, key: "clientes" },
    { name: "Medicamentos", href: "/medicamentos", icon: Pill, key: "medicamentos" },
    { name: "Usuarios", href: "/usuarios", icon: UserCheck, key: "usuarios" },
    { name: "Categorías", href: "/categorias", icon: FolderOpen, key: "categorias" },
    { name: "Proveedores", href: "/proveedores", icon: Truck, key: "proveedores" },
]

interface SidebarProps {
    children: React.ReactNode
}

export function Sidebar({ children }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const pathname = usePathname()
    const { data: currentUser, isLoading, isError } = useCurrentUser()
    const { user, setUser } = useUser()

    useEffect(() => {
        if (currentUser) {
            setUser(currentUser)
        }
    }, [currentUser, setUser])

    const allowedItems = user ? navigationItems.filter((item) =>
        USER_ROLES[user.roles[0] as keyof typeof USER_ROLES]?.includes(item.key)
    ) : []

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (isError) {
        return <div>Error fetching user</div>
    }

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div
                className={cn(
                    "bg-sidebar border-r border-sidebar-border transition-all duration-300",
                    isCollapsed ? "w-16" : "w-64"
                )}
            >
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
                        {!isCollapsed && user && (
                            <div>
                                <h2 className="text-lg font-semibold text-sidebar-foreground">Farmacia App</h2>
                                <p className="text-sm text-sidebar-foreground/60">{user.username}</p>
                                <p className="text-xs text-sidebar-foreground/40 capitalize">{user.roles.join(", ")}</p>
                            </div>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="text-sidebar-foreground hover:bg-sidebar-accent"
                        >
                            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
                        </Button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2">
                        {allowedItems.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href
                            return (
                                <Link key={item.key} href={item.href}>
                                    <Button
                                        variant={isActive ? "default" : "ghost"}
                                        className={cn(
                                            "w-full justify-start gap-3",
                                            isActive
                                                ? "bg-primary text-primary-foreground"
                                                : "text-foreground hover:bg-primary/80 hover:text-primary-foreground",
                                            isCollapsed && "px-2"
                                        )}
                                    >
                                        <Icon className="h-4 w-4 flex-shrink-0" />
                                        {!isCollapsed && <span>{item.name}</span>}
                                    </Button>
                                </Link>
                            )
                        })}
                    </nav>
                </div>
            </div>

            <main className="flex-1">{children}</main>
        </div>
    )
}
