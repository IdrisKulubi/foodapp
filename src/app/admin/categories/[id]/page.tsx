import { getCategoryById } from '@/lib/actions/category.actions'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface AdminCategoryPageProps {
  params: Promise<{ id: string }> | { id: string }
}

export default async function AdminCategoryPage({ params }: AdminCategoryPageProps) {
  const resolvedParams = await params;
  const id = 'id' in resolvedParams ? resolvedParams.id : '';
  const category = await getCategoryById(id)

  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <span className="text-4xl mb-4">🏷️</span>
        <p className="text-lg text-muted-foreground mb-2">Category not found.</p>
        <Link href="/admin/categories">
          <Button variant="outline">Back to Categories</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{category.name}</h1>
        <div className="flex gap-2">
          <Link href={`/admin/categories/${category.id}/edit`}>
            <Button variant="outline">Edit</Button>
          </Link>
        </div>
      </div>
      <div className="mb-4">
        <div className="text-muted-foreground text-sm mb-2">Slug: /{category.slug}</div>
        {/* Add more fields as needed */}
      </div>
      <Link href="/admin/categories">
        <Button variant="secondary">Back to Categories</Button>
      </Link>
    </div>
  )
} 