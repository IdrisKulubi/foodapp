import AdminRecipesClient from './AdminRecipesClient'

// Use the current Next.js app router conventions
type FilterType = 'all' | 'published' | 'draft' | 'featured'
type SortType = 'createdAt' | 'title'
type SortDirType = 'asc' | 'desc'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function AdminRecipesPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams

  // Parse page and pageSize with fallbacks
  const page = Math.max(1, Number(searchParams.page) || 1)
  const pageSize = Math.max(1, Number(searchParams.pageSize) || 12)
  
  // Parse other parameters with type safety
  const sort = (searchParams.sort === 'title' ? 'title' : 'createdAt') as SortType
  const sortDir = (searchParams.sortDir === 'asc' ? 'asc' : 'desc') as SortDirType
  const search = typeof searchParams.search === 'string' ? searchParams.search : ''
  const filter = ['all', 'published', 'draft', 'featured'].includes(searchParams.filter as string) 
    ? (searchParams.filter as FilterType) 
    : 'all'

  return (
    <AdminRecipesClient
      page={page}
      pageSize={pageSize}
      sort={sort}
      sortDir={sortDir}
      search={search}
      filter={filter}
    />
  )
} 