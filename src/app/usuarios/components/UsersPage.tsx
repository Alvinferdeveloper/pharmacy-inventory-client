import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Users, Loader2 } from "lucide-react"
import { useUsers } from "@/app/hooks/useUsers"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UserTable } from "./UserTable"
import { UserFormDialog } from "./UserFormDialog"
import { useUpdateUser } from "@/app/hooks/useUpdateUser"
import { useToggleUserStatus } from "@/app/hooks/useToggleUserStatus"
import { TemporaryPasswordDialog } from "./TemporaryPasswordDialog"
import { AddUserPayload } from "@/app/hooks/useAddUser"
import { UpdateUserPayload } from "@/app/hooks/useUpdateUser"
import { useAddUser } from "@/app/hooks/useAddUser"
import { User } from "@/app/hooks/useUsers"
import { useCurrentUser } from "@/app/hooks/useCurrentUser"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDeleteUser } from "@/app/hooks/useDeleteUser"
import { DeleteUserConfirmationDialog } from "./DeleteUserConfirmationDialog"

export default function UsersPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isTempPasswordDialogOpen, setIsTempPasswordDialogOpen] = useState(false)
    const [temporaryPassword, setTemporaryPassword] = useState<string | null>(null)
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [togglingUserId, setTogglingUserId] = useState<number | null>(null)
    const [activeTab, setActiveTab] = useState("active");
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
    const [deletingUserId, setDeletingUserId] = useState<number | null>(null)

    const { data: currentUser } = useCurrentUser()
    const { data: users, isLoading, error } = useUsers()
    const { mutate: addUser, isPending: isAdding, error: addError, reset: resetAddError } = useAddUser()
    const { mutate: updateUser, isPending: isUpdating, error: updateError, reset: resetUpdateError } = useUpdateUser()
    const { mutate: toggleUserStatus, isPending: isTogglingStatus } = useToggleUserStatus()
    const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser()

    const activeUsers = users?.filter(user => user.isActive && !user.deletedAt) || [];
    const inactiveUsers = users?.filter(user => !user.isActive || user.deletedAt) || [];

    const handleAddUser = (userData: AddUserPayload | UpdateUserPayload) => {
        addUser(userData as AddUserPayload, {
            onSuccess: (data) => {
                setIsDialogOpen(false)
                setTemporaryPassword(data.temporaryPassword)
                setIsTempPasswordDialogOpen(true)
            },
        })
    }

    const handleEditUser = (userData: UpdateUserPayload | AddUserPayload) => {
        if (editingUser) {
            updateUser({ id: editingUser.idUser, payload: userData }, {
                onSuccess: () => {
                    setEditingUser(null)
                    setIsDialogOpen(false)
                }
            })
        }
    }

    const handleToggleUserStatus = (userId: number) => {
        setTogglingUserId(userId)
        toggleUserStatus(userId, {
            onSettled: () => {
                setTogglingUserId(null)
            }
        })
    }

    const handleDeleteUser = (userId: number) => {
        setDeletingUserId(userId)
        setIsDeleteConfirmOpen(true)
    }

    const confirmDelete = () => {
        if (deletingUserId) {
            deleteUser(deletingUserId, {
                onSuccess: () => {
                    setDeletingUserId(null)
                    setIsDeleteConfirmOpen(false)
                }
            })
        }
    }

    const openEditDialog = (user: User) => {
        setEditingUser(user)
        setIsDialogOpen(true)
    }

    const openAddDialog = () => {
        setEditingUser(null)
        setIsDialogOpen(true)
    }

    const handleDialogChange = (isOpen: boolean) => {
        setIsDialogOpen(isOpen)
        if (!isOpen) {
            setEditingUser(null)
            resetAddError()
            resetUpdateError()
        }
    }

    const canManageUsers = currentUser?.roles.includes("Administrator");

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Gestión de Usuarios</h1>
                        <p className="text-muted-foreground">Administra los usuarios del sistema</p>
                    </div>
                </div>
                {canManageUsers && (
                    <Button onClick={openAddDialog} className="bg-primary hover:bg-primary/90 w-full md:w-auto">
                        <Plus className="h-4 w-4 mr-2" />
                        Nuevo Usuario
                    </Button>
                )}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="active">Usuarios Activos</TabsTrigger>
                    <TabsTrigger value="inactive">Usuarios Inactivos/Eliminados</TabsTrigger>
                </TabsList>
                <TabsContent value="active">
                    <Card>
                        <CardHeader>
                            <CardTitle>Lista de Usuarios Activos</CardTitle>
                            <CardDescription>{activeUsers.length} usuarios activos registrados en el sistema</CardDescription>
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
                            {!isLoading && !error && activeUsers.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                    No se encontraron usuarios activos.
                                </div>
                            )}
                            {activeUsers && <UserTable users={activeUsers} onEdit={openEditDialog} onToggleStatus={handleToggleUserStatus} onDelete={handleDeleteUser} isTogglingStatus={isTogglingStatus} togglingUserId={togglingUserId} canManageUsers={canManageUsers} />}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="inactive">
                    <Card>
                        <CardHeader>
                            <CardTitle>Lista de Usuarios Inactivos/Eliminados</CardTitle>
                            <CardDescription>{inactiveUsers.length} usuarios inactivos o eliminados en el sistema</CardDescription>
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
                            {!isLoading && !error && inactiveUsers.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                    No se encontraron usuarios inactivos o eliminados.
                                </div>
                            )}
                            {inactiveUsers && <UserTable users={inactiveUsers} onEdit={openEditDialog} onToggleStatus={handleToggleUserStatus} onDelete={handleDeleteUser} isTogglingStatus={isTogglingStatus} togglingUserId={togglingUserId} canManageUsers={canManageUsers} />}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {canManageUsers && (
                <UserFormDialog
                    isOpen={isDialogOpen}
                    onOpenChange={handleDialogChange}
                    onSubmit={editingUser ? handleEditUser : handleAddUser}
                    editingUser={editingUser}
                    isSaving={isAdding || isUpdating}
                    error={addError || updateError}
                />
            )}

            <TemporaryPasswordDialog
                isOpen={isTempPasswordDialogOpen}
                onOpenChange={setIsTempPasswordDialogOpen}
                temporaryPassword={temporaryPassword}
            />

            <DeleteUserConfirmationDialog
                isOpen={isDeleteConfirmOpen}
                onOpenChange={setIsDeleteConfirmOpen}
                onConfirm={confirmDelete}
                isDeleting={isDeleting}
            />
        </div>
    )
}