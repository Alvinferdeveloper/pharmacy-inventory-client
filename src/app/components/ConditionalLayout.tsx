'use client'

import { usePathname } from 'next/navigation'
import { Sidebar } from './Sidebar'

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (pathname === '/login') {
    return <>{children}</>
  }

  return <Sidebar>{children}</Sidebar>
}
