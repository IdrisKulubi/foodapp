import Sidebar from '../../components/shared/Sidebar'
import { ReactNode } from 'react'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-background min-h-screen pt-20 md:pt-8 pb-20 md:pb-8">
        {children}
      </main>
    </div>
  )
} 