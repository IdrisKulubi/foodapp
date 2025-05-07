import AdminTagsClient from './AdminTagsClient'
import { getPaginatedTags } from '@/lib/actions/tag.actions'

export default async function AdminTagsPage() {
  // For now, use default values; you can extend with searchParams for filtering/sorting
  const page = 1
  const pageSize = 24
  const search = ''

  const { tags, total } = await getPaginatedTags({
    page,
    pageSize,
    search,
  })

  return <AdminTagsClient
    page={page}
    pageSize={pageSize}
    search={search}
    tags={tags}
    total={total}
  />
} 