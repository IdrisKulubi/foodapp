import Link from 'next/link'
import { ReactNode } from 'react'

interface AdminLayoutProps {
  children: ReactNode
}

const navItems = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/recipes', label: 'Recipes' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/tags', label: 'Tags' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/settings', label: 'Settings' },
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-muted border-r px-4 py-8 flex flex-col gap-4">
        <nav className="flex flex-col gap-2">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="text-base font-medium text-muted-foreground hover:text-primary transition-colors rounded px-2 py-1"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-background">
        {children}
      </main>
    </div>
  )
} 