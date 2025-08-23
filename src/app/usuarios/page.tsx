"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Users, Loader2 } from "lucide-react"
import { useUsers } from "@/app/hooks/useUsers"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UserTable } from "./components/UserTable"
import { UserFormDialog } from "./components/UserFormDialog"
import { DeleteUserConfirmationDialog } from "./components/DeleteUserConfirmationDialog"
import { User } from "@/app/hooks/useUsers"
import { AddUserPayload } from "@/app/hooks/useAddUser"
import { UpdateUserPayload } from "@/app/hooks/useUpdateUser"
import { useAddUser } from "@/app/hooks/useAddUser"
import { useUpdateUser } from "@/app/hooks/useUpdateUser"
import { useDeleteUser } from "@/app/hooks/useDeleteUser"
import { TemporaryPasswordDialog } from "./components/TemporaryPasswordDialog"

export default function UsersPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isTempPasswordDialogOpen, setIsTempPasswordDialogOpen] = useState(false)
    const [temporaryPassword, setTemporaryPassword] = useState<string | null>(null)
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [deletingUserId, setDeletingUserId] = useState<number | null>(null)

    const { data: users, isLoading, error } = useUsers()
    const { mutate: addUser, isPending: isAdding, error: addError, reset: resetAddError } = useAddUser()
    const { mutate: updateUser, isPending: isUpdating, error: updateError, reset: resetUpdateError } = useUpdateUser()
    const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser()

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

    const handleDeleteUser = (userId: number) => {
        setDeletingUserId(userId)
        setIsDeleteDialogOpen(true)
    }

    const confirmDelete = () => {
        if (deletingUserId) {
            deleteUser(deletingUserId, {
                onSuccess: () => {
                    setDeletingUserId(null)
                    setIsDeleteDialogOpen(false)
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

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Gestión de Usuarios</h1>
                        <p className="text-muted-foreground">Administra los usuarios del sistema</p>
                    </div>
                </div>
                <Button onClick={openAddDialog} className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Usuario
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Lista de Usuarios</CardTitle>
                    <CardDescription>{users?.length || 0} usuarios registrados en el sistema</CardDescription>
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
                    {users && <UserTable users={users} onEdit={openEditDialog} onDelete={handleDeleteUser} isDeleting={isDeleting} deletingUserId={deletingUserId} />}
                </CardContent>
            </Card>

            <UserFormDialog
                isOpen={isDialogOpen}
                onOpenChange={handleDialogChange}
                onSubmit={editingUser ? handleEditUser : handleAddUser}
                editingUser={editingUser}
                isSaving={isAdding || isUpdating}
                error={addError || updateError}
            />

            <DeleteUserConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={confirmDelete}
                isDeleting={isDeleting}
            />

            <TemporaryPasswordDialog
                isOpen={isTempPasswordDialogOpen}
                onOpenChange={setIsTempPasswordDialogOpen}
                temporaryPassword={temporaryPassword}
            />
        </div>
    )
}
