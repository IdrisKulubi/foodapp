import AdminCategoriesClient from './AdminCategoriesClient'
import { getPaginatedCategories } from '@/lib/actions/category.actions'

export default async function AdminCategoriesPage() {
  // For now, use default values; you can extend with searchParams for filtering/sorting
  const page = 1
  const pageSize = 24
  const search = ''
  const sort = 'name'
  const sortDir = 'asc'

  const { categories, total } = await getPaginatedCategories({
    page,
    pageSize,
    search,
    sort,
    sortDir,
  })

  return <AdminCategoriesClient
    page={page}
    pageSize={pageSize}
    search={search}
    sort={sort}
    sortDir={sortDir}
    categories={categories}
    total={total}
  />
} 