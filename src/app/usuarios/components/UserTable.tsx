"use client"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Search } from "lucide-react"
import { User } from "@/app/hooks/useUsers"
import { Loader2, UserX, Power } from "lucide-react"


interface UserTableProps {
    users: User[]
    onEdit: (user: User) => void
    onToggleStatus: (id: number, isActive: boolean) => void
    isTogglingStatus: boolean
    togglingUserId: number | null
    canManageUsers: boolean | undefined
}

export function UserTable({ users, onEdit, onToggleStatus, isTogglingStatus, togglingUserId, canManageUsers }: UserTableProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.identification.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role.roleName.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage)


    const getRoleStatus = (roleName: string) => {
        if (roleName === "Administrator") return { label: "Administrador", variant: "destructive" } as const
        if (roleName === "Salesman") return { label: "Vendedor", variant: "secondary" } as const
        return { label: "Consultor", variant: "default" } as const
    }

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                    placeholder="Buscar usuarios por nombre, usuario o rol..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Table */}
            <div className="rounded-lg border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="font-semibold">Nombre</TableHead>
                            <TableHead className="font-semibold">Usuario</TableHead>
                            <TableHead className="font-semibold">Rol</TableHead>
                            <TableHead className="font-semibold">Estado</TableHead>
                            {canManageUsers && <TableHead className="text-right font-semibold">Acciones</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedUsers.map((user) => {
                            const roleStatus = getRoleStatus(user.role.roleName)
                            const isActive = user.deletedAt === null
                            return (
                                <TableRow key={user.idUser} className="hover:bg-muted/30 transition-colors">
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.identification}</TableCell>
                                    <TableCell>
                                        <Badge variant={roleStatus.variant} className="text-xs">
                                            {roleStatus.label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={isActive ? "default" : "destructive"}>
                                            {isActive ? "Activo" : "Inactivo"}
                                        </Badge>
                                    </TableCell>
                                    {canManageUsers && (
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="outline" size="icon" onClick={() => onEdit(user)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant={isActive ? "destructive" : "default"}
                                                    size="icon"
                                                    onClick={() => onToggleStatus(user.idUser, !isActive)}
                                                    disabled={isTogglingStatus && togglingUserId === user.idUser}
                                                >
                                                    {isTogglingStatus && togglingUserId === user.idUser ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : isActive ? (
                                                        <UserX className="h-4 w-4" />
                                                    ) : (
                                                        <Power className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </TableCell>
                                    )}
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredUsers.length)} de{" "}
                        {filteredUsers.length} usuarios
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Anterior
                        </Button>
                        <span className="text-sm">
                            Página {currentPage} de {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Siguiente
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}