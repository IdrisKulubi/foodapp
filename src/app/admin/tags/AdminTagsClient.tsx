"use client"

import { useState, useRef, useEffect, useCallback } from 'react'
import { getPaginatedTags, getAllTags, deleteTag } from '@/lib/actions/tag.actions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { AddTagDialog } from './AddTagDialog'
import { EditTagDialog } from './EditTagDialog'


interface Tag {
  id: string
  name: string
  slug: string
}

interface AdminTagsClientProps {
  page: number
  pageSize: number
  search: string
  tags: Tag[]
  total: number
}

export default function AdminTagsClient({ page: initialPage, pageSize, search: initialSearch, tags: initialTags, total }: AdminTagsClientProps) {
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editTag, setEditTag] = useState<Tag | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [tags, setTags] = useState<Tag[]>(initialTags)
  const [page, setPage] = useState(initialPage)
  const [hasMore, setHasMore] = useState(initialTags.length < total)
  const [loading, setLoading] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [search, setSearch] = useState(initialSearch)
  const selectAllRef = useRef<HTMLInputElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const allSelected = tags.length > 0 && selectedIds.length === tags.length
  const someSelected = selectedIds.length > 0 && selectedIds.length < tags.length

  // Fetch more tags for infinite scroll
  const fetchTags = useCallback(async () => {
    setLoading(true)
    const { tags: newTags, total: newTotal } = await getPaginatedTags({
      page: page + 1,
      pageSize,
      search,
    })
    setTags(prev => [...prev, ...newTags])
    setPage(prev => prev + 1)
    setHasMore(tags.length + newTags.length < newTotal)
    setLoading(false)
  }, [page, pageSize, search, tags.length])

  // Infinite scroll observer
  useEffect(() => {
    if (!hasMore || loading) return
    const observer = new window.IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        fetchTags()
      }
    }, { threshold: 1 })
    if (sentinelRef.current) observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [hasMore, loading, fetchTags])

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someSelected
    }
  }, [someSelected])

  const handleCreated = () => {
    setOpen(false)
    getAllTags().then(setTags)
  }

  const handleUpdated = () => {
    setEditOpen(false)
    setEditTag(null)
    getAllTags().then(setTags)
  }

  const handleDelete = async (id: string) => {
    setDeleteId(id)
    await deleteTag(id)
    setDeleteId(null)
    getAllTags().then(setTags)
  }

  const handleBulkDelete = async () => {
    setDeleteId('bulk')
    await Promise.all(selectedIds.map(id => deleteTag(id)))
    setDeleteId(null)
    setSelectedIds([])
    getAllTags().then(setTags)
  }

  const handleSelectAll = () => {
    if (allSelected) setSelectedIds([])
    else setSelectedIds(tags.map(tag => tag.id))
  }

  const handleSelect = (id: string) => {
    setSelectedIds(ids => ids.includes(id) ? ids.filter(i => i !== id) : [...ids, id])
  }

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 animate-in fade-in slide-in-from-top-2">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-1">Manage Tags</h1>
          <p className="text-muted-foreground mb-4">View, create, edit, delete, and search tags here.</p>
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search tags..."
            className="w-full md:w-64 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-primary"
            aria-label="Search tags"
          />
        </div>
        <Button size="lg" className="shadow-lg" variant="default" onClick={() => setOpen(true)}>
          + Add Tag
        </Button>
        <AddTagDialog open={open} onOpenChange={setOpen} onCreated={handleCreated} />
        <EditTagDialog open={editOpen} onOpenChange={v => { setEditOpen(v); if (!v) setEditTag(null) }} tag={editTag} onUpdated={handleUpdated} />
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
      {tags.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center py-24 animate-in fade-in">
          <span className="text-5xl mb-4">🏷️</span>
          <p className="text-lg text-muted-foreground mb-2">No tags found.</p>
          <Button size="lg" variant="default" onClick={() => setOpen(true)}>+ Add your first tag</Button>
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
                aria-label="Select all tags"
              />
              <span className="text-sm text-muted-foreground">Select All</span>
            </div>
            {tags.map((tag, i) => (
              <motion.div
                key={tag.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ delay: i * 0.05, type: 'spring', stiffness: 120 }}
                className={`bg-card rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 group overflow-hidden border border-border animate-in fade-in relative p-5 flex flex-col gap-2 ${deleteId === tag.id ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(tag.id)}
                    onChange={() => handleSelect(tag.id)}
                    className="size-5 accent-primary border rounded focus:ring focus:ring-primary/30"
                    aria-label={`Select tag ${tag.name}`}
                  />
                  <h2 className="text-lg font-semibold truncate flex-1 group-hover:text-primary transition-colors">{tag.name}</h2>
                  <Badge variant="secondary">{tag.slug}</Badge>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline" onClick={() => { setEditTag(tag); setEditOpen(true) }}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => setDeleteId(tag.id)} disabled={deleteId === tag.id}>Delete</Button>
                </div>
                {/* Delete Confirmation Dialog */}
                {deleteId === tag.id && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20 animate-in fade-in">
                    <div className="bg-card p-6 rounded shadow-xl flex flex-col gap-4 w-72 border">
                      <div className="text-lg font-semibold">Delete this tag?</div>
                      <div className="text-muted-foreground text-sm">This action cannot be undone.</div>
                      <div className="flex gap-2 mt-2">
                        <Button variant="destructive" onClick={() => handleDelete(tag.id)} disabled={deleteId === tag.id}>
                          {deleteId === tag.id ? 'Deleting...' : 'Delete'}
                        </Button>
                        <Button variant="outline" onClick={() => setDeleteId(null)} disabled={deleteId === tag.id}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                {/* Bulk Delete Confirmation Dialog */}
                {deleteId === 'bulk' && selectedIds.includes(tag.id) && i === 0 && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20 animate-in fade-in">
                    <div className="bg-card p-6 rounded shadow-xl flex flex-col gap-4 w-72 border">
                      <div className="text-lg font-semibold">Delete {selectedIds.length} tags?</div>
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