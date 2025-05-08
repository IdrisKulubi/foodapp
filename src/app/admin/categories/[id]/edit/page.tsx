import { getCategoryById, updateCategory } from '@/lib/actions/category.actions'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface AdminCategoryEditPageProps {
  params: Promise<{ id: string }>
}

export default async function AdminCategoryEditPage({ params: paramsPromise }: AdminCategoryEditPageProps) {
  const params = await paramsPromise;
  const category = await getCategoryById(params.id)

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

  async function handleUpdate(formData: FormData) {
    'use server'
    const name = formData.get('name') as string
    const slug = formData.get('slug') as string
    // Add more fields as needed
    await updateCategory(params.id, { name, slug })
    redirect(`/admin/categories/${params.id}`)
  }

  return (
    <div className="max-w-2xl mx-auto py-12">
      <h1 className="text-2xl font-bold mb-6">Edit Category</h1>
      <form action={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={category.name}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="slug">Slug</label>
          <input
            id="slug"
            name="slug"
            type="text"
            defaultValue={category.slug}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        {/* Add more fields as needed */}
        <div className="flex gap-2 mt-4">
          <Button type="submit">Save</Button>
          <Link href={`/admin/categories/${params.id}`}>
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  )
} 