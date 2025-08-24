"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCurrentUser } from "@/app/hooks/useCurrentUser"
import { Loader2 } from "lucide-react"

export default function RootPage() {
  const { data: currentUser, isLoading, isError } = useCurrentUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (isError || !currentUser) {
        router.push("/login")
      } else {
        const userRole = currentUser.roles[0]
        if (userRole === "Administrator" || userRole === "Consultant") {
          router.push("/dashboard")
        } else if (userRole === "Salesman") {
          router.push("/clientes")
        } else {
          router.push("/login")
        }
      }
    }
  }, [currentUser, isLoading, isError, router])

  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}

