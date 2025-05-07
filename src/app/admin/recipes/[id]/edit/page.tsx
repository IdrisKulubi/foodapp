import { getRecipeById } from '@/lib/actions/recipe.actions'
import { getAllCategories } from '@/lib/actions/category.actions'
import { getAllTags } from '@/lib/actions/tag.actions'
import { notFound } from 'next/navigation'
import EditRecipeForm from './EditRecipeForm'

interface AdminRecipeEditPageProps {
  params: { id: string }
}

export default async function AdminRecipeEditPage({ params }: AdminRecipeEditPageProps) {
  const recipe = await getRecipeById(params.id)
  const categories = await getAllCategories()
  const tags = await getAllTags()

  if (!recipe) {
    notFound()
  }

  return <EditRecipeForm recipe={recipe} categories={categories} tags={tags} />
} 