"use server";

import db from "../../../db/drizzle";
import { recipes } from "../../../db/schema";
import { recipeSchema, type Recipe } from "../validation";
import { eq, count, asc, desc } from "drizzle-orm";

export async function createRecipe(input: Omit<Recipe, "id" | "createdAt" | "updatedAt">) {
  const parsed = recipeSchema.omit({ id: true, createdAt: true, updatedAt: true }).safeParse(input);
  if (!parsed.success) throw new Error("Invalid recipe data");
  const [recipe] = await db.insert(recipes).values(parsed.data).returning();
  return recipe;
}

export async function getRecipeById(id: string) {
  return db.query.recipes.findFirst({ where: eq(recipes.id, id) });
}

export async function updateRecipe(id: string, input: Partial<Omit<Recipe, "id" | "createdAt" | "updatedAt">>) {
  const parsed = recipeSchema.partial().omit({ id: true, createdAt: true, updatedAt: true }).safeParse(input);
  if (!parsed.success) throw new Error("Invalid recipe data");
  const [recipe] = await db.update(recipes).set(parsed.data).where(eq(recipes.id, id)).returning();
  return recipe;
}

export async function deleteRecipe(id: string) {
  await db.delete(recipes).where(eq(recipes.id, id));
  return { success: true, id };
}

export async function getAllRecipes() {
  return db.select().from(recipes);
}

/**
 * Fetch paginated recipes for admin dashboard
 * @param page 1-based page number
 * @param pageSize number of recipes per page
 * @param sort field to sort by (default: 'createdAt')
 * @param sortDir 'asc' | 'desc' (default: 'desc')
 * @param search search term
 * @param filter filter by published/draft/featured
 * @returns { recipes: Recipe[], total: number }
 */
export async function getPaginatedRecipes({
  page = 1,
  pageSize = 12,
  sort = 'createdAt',
  sortDir = 'desc',
  search = '',
  filter = 'all',
}: {
  page?: number
  pageSize?: number
  sort?: 'createdAt' | 'title'
  sortDir?: 'asc' | 'desc'
  search?: string
  filter?: 'all' | 'published' | 'draft' | 'featured'
}) {
  const offset = (page - 1) * pageSize;
  // Build where clause
  const where: any[] = []
  if (search) {
    const s = `%${search.toLowerCase()}%`
    where.push(
      (recipes: any, { ilike, or }: any) =>
        or(ilike(recipes.title, s), ilike(recipes.slug, s))
    )
  }
  if (filter === 'published') where.push((recipes: any, { eq }: any) => eq(recipes.published, true))
  if (filter === 'draft') where.push((recipes: any, { eq }: any) => eq(recipes.published, false))
  if (filter === 'featured') where.push((recipes: any, { eq }: any) => eq(recipes.featured, true))

  // Get total count
  const totalResult = await db.query.recipes.findMany({
    where: where.length ? (recipes: any, helpers: any) => where.map(fn => fn(recipes, helpers)).reduce((a, b) => (r: any) => a(r, helpers) && b(r, helpers)) : undefined,
    columns: { id: true },
  })
  const total = totalResult.length

  // Fetch paginated recipes
  const orderBy = sort === 'title' ? recipes.title : recipes.createdAt;
  const paginated = await db.query.recipes.findMany({
    where: where.length ? (recipes: any, helpers: any) => where.map(fn => fn(recipes, helpers)).reduce((a, b) => (r: any) => a(r, helpers) && b(r, helpers)) : undefined,
    orderBy: (recipes: any, { asc, desc }: any) => [sortDir === 'asc' ? asc(orderBy) : desc(orderBy)],
    limit: pageSize,
    offset,
  })
  return { recipes: paginated, total };
} 