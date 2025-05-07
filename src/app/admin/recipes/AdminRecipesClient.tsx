"use client"

import { useState, useTransition, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { motion, AnimatePresence } from 'framer-motion'
import { deleteRecipe, getPaginatedRecipes, setRecipeTrending, setRecipeFeatured } from '@/lib/actions/recipe.actions'
import Image from 'next/image'
import { Switch } from '@/components/ui/switch'

interface Recipe {
  id: string
  title: string
  slug: string
  featured?: boolean
  published?: boolean
  images?: string[]
  createdAt?: string
  trending?: boolean
}

interface AdminRecipesClientProps {
  page: number
  pageSize: number
  sort: 'createdAt' | 'title'
  sortDir: 'asc' | 'desc'
  search: string
  filter: 'all' | 'published' | 'draft' | 'featured'
  recipes: Recipe[]
  total: number
}

function buildPageUrl({ page, pageSize, sort, sortDir, search, filter }: { page: number; pageSize: number; sort: 'createdAt' | 'title'; sortDir: 'asc' | 'desc'; search?: string; filter?: string }) {
  const params = new URLSearchParams()
  if (page > 1) params.set('page', String(page))
  if (pageSize !== 12) params.set('pageSize', String(pageSize))
  if (sort !== 'createdAt') params.set('sort', sort)
  if (sortDir !== 'desc') params.set('sortDir', sortDir)
  if (search) params.set('search', search)
  if (filter && filter !== 'all') params.set('filter', filter)
  return `?${params.toString()}`
}

export default function AdminRecipesClient({ page: initialPage, pageSize, sort, sortDir, search, filter, recipes: initialRecipes, total }: AdminRecipesClientProps) {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes)
  const [page, setPage] = useState(initialPage)
  const [hasMore, setHasMore] = useState(initialRecipes.length < total)
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const sentinelRef = useRef<HTMLDivElement>(null)

  // Fetch more recipes for infinite scroll
  const fetchRecipes = useCallback(async () => {
    setLoading(true)
    const { recipes: newRecipes, total: newTotal } = await getPaginatedRecipes({ page: page + 1, pageSize, sort, sortDir, search, filter })
    const safeRecipes = newRecipes.map(r => ({
      ...r,
      featured: !!r.featured,
      published: !!r.published,
      createdAt: r.createdAt ? String(r.createdAt) : undefined,
      trending: r.trending ?? false,
    }))
    setRecipes(prev => [...prev, ...safeRecipes])
    setPage(prev => prev + 1)
    setHasMore(recipes.length + safeRecipes.length < newTotal)
    setLoading(false)
  }, [page, pageSize, sort, sortDir, search, filter, recipes.length])

  // Infinite scroll observer
  useEffect(() => {
    if (!hasMore || loading) return
    const observer = new window.IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        fetchRecipes()
      }
    }, { threshold: 1 })
    if (sentinelRef.current) observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [hasMore, loading, fetchRecipes])

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    startTransition(async () => {
      try {
        await deleteRecipe(id)
        setConfirmId(null)
        setRecipes(prev => prev.filter(r => r.id !== id))
      } finally {
        setDeletingId(null)
      }
    })
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4 animate-in fade-in slide-in-from-top-2">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:gap-4 w-full">
          <form
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              const form = e.currentTarget;
              const value = (form.elements.namedItem('search') as HTMLInputElement).value;
              window.location.href = buildPageUrl({
                page: 1,
                pageSize,
                sort,
                sortDir,
                search: value,
                filter
              });
            }}
            className="flex gap-2"
            role="search"
            aria-label="Search recipes"
          >
            <Input
              type="search"
              name="search"
              defaultValue={search}
              placeholder="Search recipes..."
              className="w-full md:w-64"
              aria-label="Search recipes"
            />
            <Button type="submit" variant="outline">Search</Button>
          </form>
          <select
            value={filter}
            onChange={e => {
              window.location.href = buildPageUrl({
                page: 1,
                pageSize,
                sort,
                sortDir,
                search,
                filter: e.target.value
              })
            }}
            className="border rounded px-2 py-1 text-sm bg-background"
            aria-label="Filter recipes"
          >
            <option value="all">All</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="featured">Featured</option>
          </select>
          <select
            value={sort}
            onChange={e => {
              window.location.href = buildPageUrl({
                page: 1,
                pageSize,
                sort: e.target.value as 'createdAt' | 'title',
                sortDir,
                search,
                filter
              })
            }}
            className="border rounded px-2 py-1 text-sm bg-background"
            aria-label="Sort by"
          >
            <option value="createdAt">Sort by Date</option>
            <option value="title">Sort by Title</option>
          </select>
          <select
            value={sortDir}
            onChange={e => {
              window.location.href = buildPageUrl({
                page: 1,
                pageSize,
                sort,
                sortDir: e.target.value as 'asc' | 'desc',
                search,
                filter
              })
            }}
            className="border rounded px-2 py-1 text-sm bg-background"
            aria-label="Sort direction"
          >
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
        </div>
        <Link href="/admin/recipes/new">
          <Button size="lg" className="shadow-lg">+ Create Recipe</Button>
        </Link>
      </div>
      {recipes.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center py-24 animate-in fade-in">
          <span className="text-4xl mb-4">🍽️</span>
          <p className="text-lg text-muted-foreground mb-2">No recipes found.</p>
        </div>
      ) : (
        <AnimatePresence>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe, i) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ delay: i * 0.05, type: 'spring', stiffness: 120 }}
                className="bg-card rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 group overflow-hidden border border-border animate-in fade-in relative"
              >
                {/* Link to recipe details - only wraps image and title */}
                <div className="flex flex-col h-full">
                  <Link href={`/admin/recipes/${recipe.id}`} className="block focus:outline-none focus:ring-2 focus:ring-primary/60">
                    <div className="aspect-[4/2.2] bg-muted flex items-center justify-center relative">
                      {recipe.images && recipe.images.length > 0 ? (
                        <Image 
                          src={recipe.images[0]} 
                          alt={recipe.title} 
                          className="object-cover" 
                          fill 
                          sizes="(max-width: 768px) 100vw, 33vw"
                          style={{ pointerEvents: 'none' }} // Prevent image from capturing clicks
                        />
                      ) : (
                        <span className="text-5xl opacity-30 group-hover:scale-110 transition-transform">🍲</span>
                      )}
                    </div>
                    <div className="p-4">
                      <h2 className="text-lg font-semibold truncate group-hover:text-primary transition-colors">{recipe.title}</h2>
                      <span className="text-xs text-muted-foreground truncate">/recipes/{recipe.slug}</span>
                    </div>
                  </Link>
                  
                  {/* Status badges */}
                  <div className="px-4 flex flex-wrap items-center gap-2 mb-2">
                    {recipe.featured && <Badge variant="default">Featured</Badge>}
                    {recipe.trending && <Badge variant="secondary">Trending</Badge>}
                    {recipe.published ? (
                      <Badge variant="outline">Published</Badge>
                    ) : (
                      <Badge variant="secondary">Draft</Badge>
                    )}
                  </div>

                  {/* Action buttons - make more prominent */}
                  <div className="absolute top-2 right-2 flex gap-2 z-20">
                    <Link href={`/admin/recipes/${recipe.id}/edit`} onClick={(e) => e.stopPropagation()}>
                      <Button 
                        size="icon" 
                        variant="outline" 
                        className="bg-white/90 backdrop-blur-sm hover:bg-primary hover:text-white transition-colors shadow-md h-9 w-9" 
                        aria-label="Edit recipe"
                      >
                        ✏️
                      </Button>
                    </Link>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="hover:bg-red-600 transition-colors shadow-md h-9 w-9"
                      aria-label="Delete recipe"
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmId(recipe.id);
                      }}
                      disabled={isPending && deletingId === recipe.id}
                    >
                      {isPending && deletingId === recipe.id ? '⏳' : '🗑️'}
                    </Button>
                  </div>

                  {/* Action toggles with improved UI */}
                  <div className="mt-auto px-4 pb-4 pt-2 border-t border-border/50 bg-muted/20 relative z-10">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 rounded-lg p-2 bg-background/90 shadow-sm hover:shadow transition-shadow cursor-pointer">
                        <span className="text-sm">Trending</span>
                        <Switch
                          checked={!!recipe.trending}
                          onCheckedChange={async (checked) => {
                            const updated = await setRecipeTrending(recipe.id, checked);
                            setRecipes(prev =>
                              prev.map(r =>
                                r.id === recipe.id
                                  ? { ...r, trending: !!updated.trending }
                                  : r
                              )
                            );
                          }}
                          className="data-[state=checked]:bg-orange-500 z-10"
                          aria-label={recipe.trending ? 'Remove from trending' : 'Mark as trending'}
                        />
                      </div>
                      
                      <div className="flex items-center gap-2 rounded-lg p-2 bg-background/90 shadow-sm hover:shadow transition-shadow cursor-pointer">
                        <span className="text-sm">Featured</span>
                        <Switch
                          checked={!!recipe.featured}
                          onCheckedChange={async (checked) => {
                            const updated = await setRecipeFeatured(recipe.id, checked);
                            setRecipes(prev =>
                              prev.map(r =>
                                r.id === recipe.id
                                  ? { ...r, featured: !!updated.featured }
                                  : r
                              )
                            );
                          }}
                          className="data-[state=checked]:bg-blue-500 z-10"
                          aria-label={recipe.featured ? 'Remove from featured' : 'Mark as featured'}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Confirm Delete Dialog */}
                {confirmId === recipe.id && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20 animate-in fade-in">
                    <div className="bg-card p-6 rounded shadow-xl flex flex-col gap-4 w-72 border">
                      <div className="text-lg font-semibold">Delete this recipe?</div>
                      <div className="text-muted-foreground text-sm">This action cannot be undone.</div>
                      <div className="flex gap-2 mt-2">
                        <Button variant="destructive" onClick={() => handleDelete(recipe.id)} disabled={isPending && deletingId === recipe.id}>
                          {isPending && deletingId === recipe.id ? 'Deleting...' : 'Delete'}
                        </Button>
                        <Button variant="outline" onClick={() => setConfirmId(null)} disabled={isPending}>
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