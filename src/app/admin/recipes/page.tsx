import { getPaginatedRecipes } from '@/lib/actions/recipe.actions'
import AdminRecipesClient from './AdminRecipesClient'

interface AdminRecipesPageProps {
  searchParams: {
    page?: string
    pageSize?: string
    sort?: 'createdAt' | 'title'
    sortDir?: 'asc' | 'desc'
    search?: string
    filter?: 'all' | 'published' | 'draft' | 'featured'
  }
}

export default async function AdminRecipesPage({ searchParams }: AdminRecipesPageProps) {
  const page = Number(searchParams.page) > 0 ? Number(searchParams.page) : 1
  const pageSize = Number(searchParams.pageSize) > 0 ? Number(searchParams.pageSize) : 12
  const sort = searchParams.sort === 'title' ? 'title' : 'createdAt'
  const sortDir = searchParams.sortDir === 'asc' ? 'asc' : 'desc'
  const search = searchParams.search ?? ''
  const filter = searchParams.filter ?? 'all'
  const { recipes, total } = await getPaginatedRecipes({ page, pageSize, sort, sortDir, search, filter })
  // Map null featured/published to boolean for client
  const safeRecipes = recipes.map(r => ({
    ...r,
    featured: !!r.featured,
    published: !!r.published,
    createdAt: r.createdAt ? String(r.createdAt) : undefined,
  }))
  return <AdminRecipesClient recipes={safeRecipes} total={total} page={page} pageSize={pageSize} sort={sort} sortDir={sortDir} search={search} filter={filter} />
} 