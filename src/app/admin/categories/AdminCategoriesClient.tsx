"use client"

import { useState, useRef, useEffect, useCallback } from 'react'
import { getPaginatedCategories, getAllCategories, deleteCategory } from '@/lib/actions/category.actions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import AddCategoryDialog from './AddCategoryDialog'
import EditCategoryDialog from './EditCategoryDialog'

interface Category {
  id: string
  name: string
  slug: string
}

const pageSize = 24

export default function AdminCategoriesClient() {
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editCategory, setEditCategory] = useState<Category | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<'name' | 'slug'>('name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const selectAllRef = useRef<HTMLInputElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const allSelected = categories.length > 0 && selectedIds.length === categories.length
  const someSelected = selectedIds.length > 0 && selectedIds.length < categories.length

  // Fetch paginated categories
  const fetchCategories = useCallback(async (reset = false) => {
    setLoading(true)
    const { categories: newCategories, total } = await getPaginatedCategories({
      page: reset ? 1 : page,
      pageSize,
      search,
      sort,
      sortDir,
    })
    setCategories(prev => reset ? newCategories : [...prev, ...newCategories])
    setHasMore(reset ? newCategories.length < total : (categories.length + newCategories.length) < total)
    setLoading(false)
  }, [page, search, sort, sortDir])

  // Initial load
  useEffect(() => {
    fetchCategories(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Reset on search/filter/sort
  useEffect(() => {
    setPage(1)
    setCategories([])
    setHasMore(true)
    fetchCategories(true)
  }, [search, sort, sortDir, fetchCategories])

  // Fetch more on page change
  useEffect(() => {
    if (page === 1) return
    fetchCategories()
  }, [page, fetchCategories])

  // Infinite scroll
  useEffect(() => {
    if (!hasMore || loading) return
    const observer = new window.IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(p => p + 1)
      }
    }, { threshold: 1 })
    if (sentinelRef.current) observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [hasMore, loading])

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someSelected
    }
  }, [someSelected])

  const handleCreated = () => {
    setOpen(false)
    getAllCategories().then(setCategories)
  }

  const handleUpdated = () => {
    setEditOpen(false)
    setEditCategory(null)
    getAllCategories().then(setCategories)
  }

  const handleDelete = async (id: string) => {
    setDeleteId(id)
    await deleteCategory(id)
    setDeleteId(null)
    getAllCategories().then(setCategories)
  }

  const handleBulkDelete = async () => {
    setDeleteId('bulk')
    await Promise.all(selectedIds.map(id => deleteCategory(id)))
    setDeleteId(null)
    setSelectedIds([])
    getAllCategories().then(setCategories)
  }

  const handleSelectAll = () => {
    if (allSelected) setSelectedIds([])
    else setSelectedIds(categories.map(cat => cat.id))
  }

  const handleSelect = (id: string) => {
    setSelectedIds(ids => ids.includes(id) ? ids.filter(i => i !== id) : [...ids, id])
  }

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 animate-in fade-in slide-in-from-top-2">
        <div className="flex-1 flex flex-col gap-2">
          <h1 className="text-2xl font-bold mb-1">Manage Categories</h1>
          <p className="text-muted-foreground">View, create, edit, delete, search, filter, and sort categories here.</p>
          <form
            onSubmit={e => { e.preventDefault(); }}
            className="flex gap-2 mt-2"
            role="search"
            aria-label="Search categories"
          >
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search categories..."
              className="w-full md:w-64 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-primary"
              aria-label="Search categories"
            />
            <select
              value={sort}
              onChange={e => setSort(e.target.value as 'name' | 'slug')}
              className="border rounded px-2 py-1 text-sm bg-background"
              aria-label="Sort by"
            >
              <option value="name">Sort by Name</option>
              <option value="slug">Sort by Slug</option>
            </select>
            <select
              value={sortDir}
              onChange={e => setSortDir(e.target.value as 'asc' | 'desc')}
              className="border rounded px-2 py-1 text-sm bg-background"
              aria-label="Sort direction"
            >
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>
          </form>
        </div>
        <Button size="lg" className="shadow-lg" variant="default" onClick={() => setOpen(true)}>
          + Add Category
        </Button>
        <AddCategoryDialog open={open} onOpenChange={setOpen} onCreated={handleCreated} />
        <EditCategoryDialog open={editOpen} onOpenChange={v => { setEditOpen(v); if (!v) setEditCategory(null) }} category={editCategory} onUpdated={handleUpdated} />
      </div>
      {/* Bulk actions bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 bg-card border shadow-xl rounded-lg px-6 py-3 flex items-center gap-4 animate-in fade-in">
          <span className="font-medium">{selectedIds.length} selected</span>
          <Button variant="destructive" onClick={() => setDeleteId('bulk')} disabled={deleteId === 'bulk'}>
            {deleteId === 'bulk' ? 'Deleting...' : 'Delete Selected'}
          </Button>
          <Button variant="outline" onClick={() => setSelectedIds([])} disabled={deleteId === 'bulk'}>Clear</Button>
        </div>
      )}
      {categories.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center py-24 animate-in fade-in">
          <span className="text-5xl mb-4">🏷️</span>
          <p className="text-lg text-muted-foreground mb-2">No categories found.</p>
          <Button size="lg" variant="default" onClick={() => setOpen(true)}>+ Add your first category</Button>
        </div>
      ) : (
        <AnimatePresence>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Select All checkbox row */}
            <div className="col-span-full flex items-center gap-2 mb-2">
              <input
                ref={selectAllRef}
                type="checkbox"
                checked={allSelected}
                onChange={handleSelectAll}
                className="size-5 accent-primary border rounded focus:ring focus:ring-primary/30"
                aria-label="Select all categories"
              />
              <span className="text-sm text-muted-foreground">Select All</span>
            </div>
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ delay: i * 0.05, type: 'spring', stiffness: 120 }}
                className={`bg-card rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 group overflow-hidden border border-border animate-in fade-in relative p-5 flex flex-col gap-2 ${deleteId === cat.id ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(cat.id)}
                    onChange={() => handleSelect(cat.id)}
                    className="size-5 accent-primary border rounded focus:ring focus:ring-primary/30"
                    aria-label={`Select category ${cat.name}`}
                  />
                  <h2 className="text-lg font-semibold truncate flex-1 group-hover:text-primary transition-colors">{cat.name}</h2>
                  <Badge variant="secondary">{cat.slug}</Badge>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline" onClick={() => { setEditCategory(cat); setEditOpen(true) }}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => setDeleteId(cat.id)} disabled={deleteId === cat.id}>Delete</Button>
                </div>
                {/* Delete Confirmation Dialog */}
                {deleteId === cat.id && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20 animate-in fade-in">
                    <div className="bg-card p-6 rounded shadow-xl flex flex-col gap-4 w-72 border">
                      <div className="text-lg font-semibold">Delete this category?</div>
                      <div className="text-muted-foreground text-sm">This action cannot be undone.</div>
                      <div className="flex gap-2 mt-2">
                        <Button variant="destructive" onClick={() => handleDelete(cat.id)} disabled={deleteId === cat.id}>
                          {deleteId === cat.id ? 'Deleting...' : 'Delete'}
                        </Button>
                        <Button variant="outline" onClick={() => setDeleteId(null)} disabled={deleteId === cat.id}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                {/* Bulk Delete Confirmation Dialog */}
                {deleteId === 'bulk' && selectedIds.includes(cat.id) && i === 0 && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20 animate-in fade-in">
                    <div className="bg-card p-6 rounded shadow-xl flex flex-col gap-4 w-72 border">
                      <div className="text-lg font-semibold">Delete {selectedIds.length} categories?</div>
                      <div className="text-muted-foreground text-sm">This action cannot be undone.</div>
                      <div className="flex gap-2 mt-2">
                        <Button variant="destructive" onClick={handleBulkDelete} disabled={deleteId === 'bulk'}>
                          {deleteId === 'bulk' ? 'Deleting...' : 'Delete Selected'}
                        </Button>
                        <Button variant="outline" onClick={() => setDeleteId(null)} disabled={deleteId === 'bulk'}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
            {/* Infinite scroll sentinel */}
            {hasMore && (
              <div ref={sentinelRef} className="col-span-full flex justify-center py-6">
                <span className="animate-spin text-primary w-8 h-8 block">⏳</span>
              </div>
            )}
            {loading && !hasMore && (
              <div className="col-span-full flex justify-center py-6">
                <span className="animate-spin text-primary w-8 h-8 block">⏳</span>
              </div>
            )}
          </div>
        </AnimatePresence>
      )}
    </div>
  )
} 