"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, ChefHat, FolderClosed, Tag,
  ChevronLeft, Menu 
} from 'lucide-react'
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip"
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// Navigation items definition
const navItems = [
  { 
    title: 'Dashboard', 
    href: '/admin', 
    icon: Home,
    description: 'Overview and statistics'
  },
  { 
    title: 'Recipes', 
    href: '/admin/recipes', 
    icon: ChefHat,
    description: 'Manage your recipes'
  },
  { 
    title: 'Categories', 
    href: '/admin/categories', 
    icon: FolderClosed,
    description: 'Organize content'
  },
  { 
    title: 'Tags', 
    href: '/admin/tags', 
    icon: Tag,
    description: 'Manage tags'
  },
 
]

export default function Sidebar() {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Handle screen resize for responsive design
  useEffect(() => {
    setMounted(true)
    
    // Initial check
    if (window.innerWidth < 1024) {
      setExpanded(false)
    }

    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setExpanded(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Close mobile menu when navigating
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  if (!mounted) return null // Prevent hydration mismatch

  return (
    <>
      {/* Mobile Menu Button - Fixed to the top */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-background/80 backdrop-blur-md border-b">
        <span className="font-semibold">Food Admin</span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="relative"
        >
          <Menu size={20} />
        </Button>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Panel */}
      <motion.aside
        className={cn(
          // Base styles
          "fixed z-40 bg-gradient-to-b from-background via-background to-muted/20 border-r shadow-xl overflow-y-auto",
          // Mobile styles - hidden by default, shown via overlay when menu is opened
          "top-0 bottom-0 left-0 w-[280px] p-4 flex flex-col gap-6",
          // Desktop styles - always visible
          "lg:relative lg:shadow-none lg:translate-x-0 lg:z-30",
          expanded ? "lg:w-[280px]" : "lg:w-[80px]",
          // Additional responsive transforms
          "transform lg:transform-none",
          !mobileOpen && "translate-x-[-280px] lg:translate-x-0"
        )}
        initial={false}
        animate={{ 
          width: expanded ? 280 : 80,
          transition: {
            type: 'spring',
            damping: 20,
          }
        }}
      >
        {/* Header with Logo and Toggle */}
        <div className="flex items-center justify-between pb-4 border-b">
          <AnimatePresence mode="wait">
            {(expanded || mobileOpen) ? (
              <motion.div 
                className="flex items-center gap-2" 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <span className="text-2xl">🍽️</span>
                <h1 className="font-bold truncate">Culinary Admin</h1>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <span className="text-2xl">🍽️</span>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setExpanded(x => !x)}
            className="hidden lg:flex"
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            <ChevronLeft 
              size={18} 
              className={cn(
                "transition-transform duration-300", 
                !expanded && "rotate-180"
              )} 
            />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden"
            aria-label="Close menu"
          >
            <ChevronLeft size={18} />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-1 py-4">
          <TooltipProvider delayDuration={100}>
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link 
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all",
                        "hover:bg-primary/10 active:scale-95",
                        isActive 
                          ? "bg-primary/10 text-primary font-semibold" 
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <item.icon size={20} 
                        className={cn(
                          "shrink-0",
                          isActive && "text-primary"
                        )} 
                      />
                      
                      <AnimatePresence mode="wait">
                        {(expanded || mobileOpen) && (
                          <motion.span 
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            className="whitespace-nowrap overflow-hidden"
                          >
                            {item.title}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      
                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="active-nav"
                          className="absolute right-0 w-1 h-6 bg-primary rounded-l-full"
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30
                          }}
                        />
                      )}
                    </Link>
                  </TooltipTrigger>
                  {!expanded && !mobileOpen && (
                    <TooltipContent side="right" className="flex flex-col">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              )
            })}
          </TooltipProvider>
        </nav>

        
      </motion.aside>
    </>
  )
} 