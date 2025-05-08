import { getRecipeById } from '@/lib/actions/recipe.actions'
import { getAllCategories } from '@/lib/actions/category.actions'
import { getAllTags } from '@/lib/actions/tag.actions'
import { notFound } from 'next/navigation'
import EditRecipeForm from './EditRecipeForm'

interface AdminRecipeEditPageProps {
  params: Promise<{ id: string }> | { id: string }
}

export default async function AdminRecipeEditPage({ params }: AdminRecipeEditPageProps) {
  const resolvedParams = await params;
  const id = 'id' in resolvedParams ? resolvedParams.id : '';
  const recipe = await getRecipeById(id)
  const categories = await getAllCategories()
  const tags = await getAllTags()

  if (!recipe) {
    notFound()
  }

  return <EditRecipeForm recipe={recipe} categories={categories} tags={tags} />
} 