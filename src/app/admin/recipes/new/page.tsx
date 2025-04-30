import { getAllCategories } from '@/lib/actions/category.actions'
import { getAllTags } from '@/lib/actions/tag.actions'
import RecipeEditorClient from './RecipeEditorClient'

export default async function RecipeEditorPageWrapper() {
  const categories = await getAllCategories()
  const tags = await getAllTags()

  return <RecipeEditorClient categories={categories} tags={tags} />
} 