import { getRecipeById } from '@/lib/actions/recipe.actions'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface AdminRecipePageProps {
  params: { id: string }
}

export default async function AdminRecipePage({ params }: AdminRecipePageProps) {
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

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{recipe.title}</h1>
        <div className="flex gap-2">
          <Link href={`/admin/recipes/${recipe.id}/edit`}>
            <Button variant="outline">Edit</Button>
          </Link>
        </div>
      </div>
      <div className="mb-4">
        <div className="text-muted-foreground text-sm mb-2">Slug: /{recipe.slug}</div>
        <div className="text-muted-foreground text-sm mb-2">Created: {recipe.createdAt?.toString()}</div>
        <div className="text-muted-foreground text-sm mb-2">Published: {recipe.published ? 'Yes' : 'No'}</div>
        <div className="text-muted-foreground text-sm mb-2">Featured: {recipe.featured ? 'Yes' : 'No'}</div>
        <div className="text-muted-foreground text-sm mb-2">Trending: {recipe.trending ? 'Yes' : 'No'}</div>
        <div className="text-muted-foreground text-sm mb-2">Description: {recipe.description}</div>
        {/* Add more fields as needed */}
      </div>
      <Link href="/admin/recipes">
        <Button variant="secondary">Back to Recipes</Button>
      </Link>
    </div>
  )
} 