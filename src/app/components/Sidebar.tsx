"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, Pill, UserCheck, FolderOpen, Truck, Menu, X, FileText, BookCopy, DatabaseBackup, Activity } from "lucide-react"
import { useCurrentUser } from "@/app/hooks/useCurrentUser"
import { useUser } from "@/app/context/UserContext"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react";
import { useLogout } from "@/app/hooks/useLogout";

import { AlertsDropdown } from "./AlertsDropdown";

const USER_ROLES = {
    Administrator: ["dashboard", "clientes", "medicamentos", "usuarios", "categorias", "proveedores", "reportes", "invoices", 'backup-restore', 'inventory-movements'],
    Salesman: ["clientes", "medicamentos", "categorias", "invoices"],
    Consultant: ["dashboard", "clientes", "medicamentos", "usuarios", "categorias", "proveedores", "reportes", "invoices", 'inventory-movements'],
}

const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, key: "dashboard" },
    { name: "Clientes", href: "/clientes", icon: Users, key: "clientes" },
    { name: "Medicamentos", href: "/medicamentos", icon: Pill, key: "medicamentos" },
    { name: "Usuarios", href: "/usuarios", icon: UserCheck, key: "usuarios" },
    { name: "Categorías", href: "/categorias", icon: FolderOpen, key: "categorias" },
    { name: "Proveedores", href: "/proveedores", icon: Truck, key: "proveedores" },
    { name: "Facturas", href: "/invoices", icon: FileText, key: "invoices" },
    { name: "Reportes", href: "/reports", icon: BookCopy, key: "reportes" },
    { name: "Respaldo", href: "/backup-restore", icon: DatabaseBackup, key: "backup-restore" },
    { name: "Movimientos", href: "/inventory-movements", icon: Activity, key: "inventory-movements" }
]

interface SidebarProps {
    children: React.ReactNode
}

export function Sidebar({ children }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(true)
    const pathname = usePathname()
    const { data: currentUser, isLoading, isError } = useCurrentUser()
    const { user, setUser } = useUser()

    const { mutate: logout } = useLogout()
    const router = useRouter()

    useEffect(() => {
        if (currentUser) {
            setUser(currentUser)
            if (currentUser.mustChangePassword && pathname !== '/change-password') {
                router.push('/change-password')
            }
        }
    }, [currentUser, setUser, pathname, router])

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
        <div className="relative min-h-screen">
            {/* Sidebar */}
            <div
                className={cn(
                    "fixed h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 z-10",
                    isCollapsed ? "w-16" : "w-64 md:w-64"
                )}
            >
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
                        {!isCollapsed && user && (
                            <div className="flex-1">
                                <h2 className="text-lg font-semibold text-sidebar-foreground">Farmacia App</h2>
                                <p className="text-sm text-sidebar-foreground/60">{user.identification}</p>
                                <p className="text-xs text-sidebar-foreground/60">{user.phone}</p>
                                <p className="text-xs text-sidebar-foreground/60">{user.email}</p>
                                <p className="text-xs text-sidebar-foreground/40 capitalize">{user.roles.join(", ")}</p>
                            </div>
                        )}
                        <div className="flex items-center flex-col gap-2 ml-auto">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground md:flex md:items-center md:justify-center hidden"
                            >
                                {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
                            </Button>
                            <AlertsDropdown />
                        </div>
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
                                            "w-full justify-start gap-3 text-primary-foreground",
                                            isActive
                                                ? "bg-primary"
                                                : " hover:bg-primary/80 hover:text-primary-foreground",
                                            isCollapsed && "px-2 justify-center"
                                        )}
                                    >
                                        <Icon className="h-4 w-4 flex-shrink-0" />
                                        {!isCollapsed && <span>{item.name}</span>}
                                    </Button>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Logout Button */}
                    <div className="p-4 border-t border-sidebar-border">
                        <Button
                            variant="ghost"
                            onClick={() => logout()}
                            className="w-full justify-start gap-3 text-primary-foreground bg-transparent hover:bg-transparent hover:opacity-70 hover:text-primary-foreground"
                        >
                            <LogOut className="h-4 w-4" />
                            {!isCollapsed && <span>Cerrar Sesión</span>}
                        </Button>
                    </div>
                </div>
            </div>

            <main className={cn(
                "flex-1 transition-all duration-300 overflow-y-auto",
                isCollapsed ? "ml-16" : "ml-64 md:ml-64"
            )}>{children}</main>
        </div>
    )
}
