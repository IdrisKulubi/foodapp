import Sidebar from '../../components/shared/Sidebar'
import { ReactNode } from 'react'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 min-h-screen pt-24 lg:pt-8">
        {children}
      </main>
    </div>
  )
} 