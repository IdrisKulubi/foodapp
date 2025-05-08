import { getRecipeById } from '@/lib/actions/recipe.actions'
import { getAllCategories } from '@/lib/actions/category.actions'
import { getAllTags } from '@/lib/actions/tag.actions'
import { notFound } from 'next/navigation'
import EditRecipeForm from './EditRecipeForm'
import { recipeSchema, type Recipe } from '@/lib/validation'

interface AdminRecipeEditPageProps {
  params: Promise<{ id: string }>
}

export default async function AdminRecipeEditPage({ params: paramsPromise }: AdminRecipeEditPageProps) {
  const params = await paramsPromise;
  const rawRecipe = await getRecipeById(params.id)
  
  if (!rawRecipe) {
    notFound()
  }

  const parsedRecipe = recipeSchema.safeParse(rawRecipe);
  if (!parsedRecipe.success) {
    console.error("Failed to parse recipe data:", parsedRecipe.error.format());
    notFound(); 
  }
  const recipe: Recipe = parsedRecipe.data;

  const categories = await getAllCategories()
  const tags = await getAllTags()

  return <EditRecipeForm recipe={recipe} categories={categories} tags={tags} />
} 