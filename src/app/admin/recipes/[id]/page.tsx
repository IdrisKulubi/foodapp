import { getRecipeById } from '@/lib/actions/recipe.actions'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { recipeSchema, type Recipe } from '@/lib/validation'
import { notFound } from 'next/navigation'

interface AdminRecipePageProps {
  params: Promise<{ id: string }> // Strictly Promise
}

export default async function AdminRecipePage({ params: paramsPromise }: AdminRecipePageProps) {
  const params = await paramsPromise; // Await here
  const rawRecipe = await getRecipeById(params.id)

  if (!rawRecipe) {
    notFound()
  }

  const parsedRecipe = recipeSchema.safeParse(rawRecipe);
  if (!parsedRecipe.success) {
    console.error("Failed to parse recipe data for display:", parsedRecipe.error.format());
    notFound();
  }
  const recipe: Recipe = parsedRecipe.data;

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
        <div className="text-muted-foreground text-sm mb-2">Author ID: {recipe.authorId}</div>
        <div className="text-muted-foreground text-sm mb-2">Created: {recipe.createdAt?.toString()}</div>
        <div className="text-muted-foreground text-sm mb-2">Published: {recipe.published ? 'Yes' : 'No'}</div>
        <div className="text-muted-foreground text-sm mb-2">Featured: {recipe.featured ? 'Yes' : 'No'}</div>
        <div className="text-muted-foreground text-sm mb-2">Trending: {recipe.trending ? 'Yes' : 'No'}</div>
        <div className="text-muted-foreground text-sm mb-2">Description: {recipe.description || 'N/A'}</div>
        {/* Add more fields as needed */}
      </div>
      <Link href="/admin/recipes">
        <Button variant="secondary">Back to Recipes</Button>
      </Link>
    </div>
  )
} 