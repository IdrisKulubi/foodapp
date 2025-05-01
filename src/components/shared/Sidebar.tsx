"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '🏠' },
  { href: '/admin/recipes', label: 'Recipes', icon: '🍲' },
  { href: '/admin/categories', label: 'Categories', icon: '📂' },
  { href: '/admin/tags', label: 'Tags', icon: '🏷️' },
  // { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 bg-gradient-to-b from-background to-muted/60 border-r px-4 py-8 flex-col gap-4 shadow-lg z-20">
        <div className="mb-8 flex items-center gap-2 px-2">
          <span className="text-2xl">🍽️</span>
          <span className="font-bold text-lg tracking-tight">Food Admin</span>
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors text-base
                ${pathname === item.href ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-primary'}`}
              aria-current={pathname === item.href ? 'page' : undefined}
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile topbar + drawer */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-background/80 border-b flex items-center justify-between px-4 py-3 shadow-sm backdrop-blur-lg">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🍽️</span>
          <span className="font-bold text-lg tracking-tight">Food Admin</span>
        </div>
        <Button size="icon" variant="ghost" aria-label="Open menu" onClick={() => setOpen(true)}>
          <Menu className="w-6 h-6" />
        </Button>
      </div>
      {/* Drawer overlay */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={() => setOpen(false)} aria-label="Close menu overlay" />
      )}
      {/* Drawer */}
      <nav className={`fixed top-0 left-0 z-50 h-full w-64 bg-background border-r shadow-lg transform transition-transform duration-300 md:hidden ${open ? 'translate-x-0' : '-translate-x-full'}`} aria-label="Sidebar" tabIndex={-1}>
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍽️</span>
            <span className="font-bold text-lg tracking-tight">Food Admin</span>
          </div>
          <Button size="icon" variant="ghost" aria-label="Close menu" onClick={() => setOpen(false)}>
            <X className="w-6 h-6" />
          </Button>
        </div>
        <div className="flex flex-col gap-1 p-4">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors text-base
                ${pathname === item.href ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-primary'}`}
              aria-current={pathname === item.href ? 'page' : undefined}
              onClick={() => setOpen(false)}
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-background/90 border-t flex justify-around items-center h-16 shadow-lg backdrop-blur-lg">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-md font-medium text-xs transition-colors
              ${pathname === item.href ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
            aria-current={pathname === item.href ? 'page' : undefined}
          >
            <span className="text-xl">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  )
} 