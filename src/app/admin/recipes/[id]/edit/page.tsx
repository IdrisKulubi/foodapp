import { getRecipeById, updateRecipe } from '@/lib/actions/recipe.actions'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface AdminRecipeEditPageProps {
  params: { id: string }
}

export default async function AdminRecipeEditPage({ params }: AdminRecipeEditPageProps) {
  const recipe = await getRecipeById(params.id)

  if (!recipe) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <span className="text-4xl mb-4">🍽️</span>
        <p className="text-lg text-muted-foreground mb-2">Recipe not found.</p>
        <Link href="/admin/recipes">
          <Button variant="outline">Back to Recipes</Button>
        </Link>
      </div>
    )
  }

  async function handleUpdate(formData: FormData) {
    'use server'
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    // Add more fields as needed
    await updateRecipe(params.id, { title, description })
    redirect(`/admin/recipes/${params.id}`)
  }

  return (
    <div className="max-w-2xl mx-auto py-12">
      <h1 className="text-2xl font-bold mb-6">Edit Recipe</h1>
      <form action={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            defaultValue={recipe.title}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            defaultValue={recipe.description || ''}
            className="w-full border rounded px-3 py-2"
            rows={4}
          />
        </div>
        {/* Add more fields as needed */}
        <div className="flex gap-2 mt-4">
          <Button type="submit">Save</Button>
          <Link href={`/admin/recipes/${params.id}`}>
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  )
} 