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

export default function AdminRecipesPage({ searchParams }: AdminRecipesPageProps) {
  // Pass only search/filter/sort params; client will handle fetching and infinite scroll
  return <AdminRecipesClient
    page={Number(searchParams.page) > 0 ? Number(searchParams.page) : 1}
    pageSize={Number(searchParams.pageSize) > 0 ? Number(searchParams.pageSize) : 12}
    sort={searchParams.sort === 'title' ? 'title' : 'createdAt'}
    sortDir={searchParams.sortDir === 'asc' ? 'asc' : 'desc'}
    search={searchParams.search ?? ''}
    filter={searchParams.filter ?? 'all'}
  />
} 