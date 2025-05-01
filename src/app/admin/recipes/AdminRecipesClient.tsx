"use client"

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { motion, AnimatePresence } from 'framer-motion'
import { deleteRecipe } from '@/lib/actions/recipe.actions'
import Image from 'next/image'

interface Recipe {
  id: string
  title: string
  slug: string
  featured?: boolean
  published?: boolean
  images?: string[]
  createdAt?: string
}

interface AdminRecipesClientProps {
  recipes: Recipe[]
  total: number
  page: number
  pageSize: number
  sort: 'createdAt' | 'title'
  sortDir: 'asc' | 'desc'
  search: string
  filter: 'all' | 'published' | 'draft' | 'featured'
}

function buildPageUrl({ page, pageSize, sort, sortDir }: { page: number; pageSize: number; sort: 'createdAt' | 'title'; sortDir: 'asc' | 'desc' }) {
  const params = new URLSearchParams()
  if (page > 1) params.set('page', String(page))
  if (pageSize !== 12) params.set('pageSize', String(pageSize))
  if (sort !== 'createdAt') params.set('sort', sort)
  if (sortDir !== 'desc') params.set('sortDir', sortDir)
  return `?${params.toString()}`
}

function PaginationControls({ page, pageSize, total, sort, sortDir }: { page: number; pageSize: number; total: number; sort: 'createdAt' | 'title'; sortDir: 'asc' | 'desc' }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const maxPageButtons = 5
  let startPage = Math.max(1, page - Math.floor(maxPageButtons / 2))
  let endPage = startPage + maxPageButtons - 1
  if (endPage > totalPages) {
    endPage = totalPages
    startPage = Math.max(1, endPage - maxPageButtons + 1)
  }
  const pageNumbers = []
  for (let i = startPage; i <= endPage; i++) pageNumbers.push(i)

  return (
    <nav className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-8" aria-label="Pagination">
      <div className="flex items-center gap-2">
        <Link
          href={buildPageUrl({ page: page - 1, pageSize, sort, sortDir })}
          aria-label="Previous page"
          className="px-3 py-1 rounded border bg-background disabled:opacity-50"
          tabIndex={page === 1 ? -1 : 0}
          aria-disabled={page === 1}
          prefetch={false}
        >
          Prev
        </Link>
        {pageNumbers.map(p => (
          <Link
            key={p}
            href={buildPageUrl({ page: p, pageSize, sort, sortDir })}
            aria-current={p === page ? 'page' : undefined}
            className={`px-3 py-1 rounded border ${p === page ? 'bg-primary text-primary-foreground font-bold' : 'bg-background'} focus:outline-none focus:ring-2 focus:ring-primary/60`}
            prefetch={false}
          >
            {p}
          </Link>
        ))}
        <Link
          href={buildPageUrl({ page: page + 1, pageSize, sort, sortDir })}
          aria-label="Next page"
          className="px-3 py-1 rounded border bg-background disabled:opacity-50"
          tabIndex={page === totalPages ? -1 : 0}
          aria-disabled={page === totalPages}
          prefetch={false}
        >
          Next
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="page-size-select" className="text-sm">Rows per page:</label>
        <select
          id="page-size-select"
          className="border rounded px-2 py-1 text-sm bg-background"
          value={pageSize}
          onChange={e => {
            // Use <Link> for accessibility, but fallback to router for instant change
            window.location.href = buildPageUrl({ page: 1, pageSize: Number(e.target.value), sort, sortDir })
          }}
          aria-label="Rows per page"
        >
          {[6, 12, 24, 48].map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
        <span className="text-xs text-muted-foreground ml-2">{`Page ${page} of ${totalPages}`}</span>
      </div>
    </nav>
  )
}

export default function AdminRecipesClient({ recipes, total, page, pageSize, sort, sortDir, search, filter }: AdminRecipesClientProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    startTransition(async () => {
      try {
        await deleteRecipe(id)
        setConfirmId(null)
      } finally {
        setDeletingId(null)
      }
    })
  }

  function buildPageUrlWithParams(params: Partial<{ page: number; pageSize: number; sort: 'createdAt' | 'title'; sortDir: 'asc' | 'desc'; search: string; filter: string }>) {
    const url = new URLSearchParams()
    if (params.page !== undefined) url.set('page', String(params.page))
    else if (page > 1) url.set('page', String(page))
    if (params.pageSize !== undefined) url.set('pageSize', String(params.pageSize))
    else if (pageSize !== 12) url.set('pageSize', String(pageSize))
    if (params.sort !== undefined) url.set('sort', params.sort)
    else if (sort !== 'createdAt') url.set('sort', sort)
    if (params.sortDir !== undefined) url.set('sortDir', params.sortDir)
    else if (sortDir !== 'desc') url.set('sortDir', sortDir)
    if (params.search !== undefined) url.set('search', params.search)
    else if (search) url.set('search', search)
    if (params.filter !== undefined) url.set('filter', params.filter)
    else if (filter !== 'all') url.set('filter', filter)
    return `?${url.toString()}`
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
              window.location.href = buildPageUrlWithParams({ page: 1, search: value });
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
              window.location.href = buildPageUrlWithParams({ page: 1, filter: e.target.value })
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
              window.location.href = buildPageUrlWithParams({ page: 1, sort: e.target.value as 'createdAt' | 'title' })
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
              window.location.href = buildPageUrlWithParams({ page: 1, sortDir: e.target.value as 'asc' | 'desc' })
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
      {recipes.length === 0 ? (
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
                <Link href={`/admin/recipes/${recipe.id}`} className="block focus:outline-none focus:ring-2 focus:ring-primary/60">
                  <div className="aspect-[4/2.2] bg-muted flex items-center justify-center">
                    {recipe.images && recipe.images.length > 0 ? (
                      <Image src={recipe.images[0]} alt={recipe.title} className="object-cover w-full h-full" />
                    ) : (
                      <span className="text-5xl opacity-30 group-hover:scale-110 transition-transform">🍲</span>
                    )}
                  </div>
                  <div className="p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-semibold truncate flex-1 group-hover:text-primary transition-colors">{recipe.title}</h2>
                      {recipe.featured && <Badge variant="default">Featured</Badge>}
                      {recipe.published ? (
                        <Badge variant="outline">Published</Badge>
                      ) : (
                        <Badge variant="secondary">Draft</Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">/{recipe.slug}</div>
                  </div>
                </Link>
                <div className="absolute top-2 right-2 flex gap-2 z-10">
                  <Link href={`/admin/recipes/${recipe.id}/edit`}>
                    <Button size="icon" variant="outline" aria-label="Edit recipe">
                      ✏️
                    </Button>
                  </Link>
                  <Button
                    size="icon"
                    variant="destructive"
                    aria-label="Delete recipe"
                    onClick={() => setConfirmId(recipe.id)}
                    disabled={isPending && deletingId === recipe.id}
                  >
                    {isPending && deletingId === recipe.id ? '⏳' : '🗑️'}
                  </Button>
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
          </div>
        </AnimatePresence>
      )}
      <PaginationControls page={page} pageSize={pageSize} total={total} sort={sort} sortDir={sortDir} />
    </div>
  )
} 