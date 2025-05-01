import { getAllCategories } from '@/lib/actions/category.actions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories()
  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="flex items-center justify-between mb-8 animate-in fade-in slide-in-from-top-2">
        <div>
          <h1 className="text-2xl font-bold mb-1">Manage Categories</h1>
          <p className="text-muted-foreground">View, create, and edit categories here.</p>
        </div>
        <Button size="lg" className="shadow-lg" variant="default">
          + Add Category
        </Button>
      </div>
      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 animate-in fade-in">
          <span className="text-5xl mb-4">🏷️</span>
          <p className="text-lg text-muted-foreground mb-2">No categories found.</p>
          <Button size="lg" variant="default">+ Add your first category</Button>
        </div>
      ) : (
        <AnimatePresence>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ delay: i * 0.05, type: 'spring', stiffness: 120 }}
                className="bg-card rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 group overflow-hidden border border-border animate-in fade-in relative p-5 flex flex-col gap-2"
              >
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-semibold truncate flex-1 group-hover:text-primary transition-colors">{cat.name}</h2>
                  <Badge variant="secondary">{cat.slug}</Badge>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`#edit-${cat.id}`}>Edit</Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  )
} 