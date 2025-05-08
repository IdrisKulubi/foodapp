/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import db from "../../../db/drizzle";
import { recipes } from "../../../db/schema";
import { recipeSchema, type Recipe } from "../validation";
import { eq } from "drizzle-orm";
import { nanoid } from 'nanoid';

export async function createRecipe(input: Omit<Recipe, "id" | "createdAt" | "updatedAt">) {
  console.log("[createRecipe] input:", input);
  const parsed = recipeSchema.omit({ id: true, createdAt: true, updatedAt: true }).safeParse(input);
  if (!parsed.success) {
    console.error("[createRecipe] validation error:", parsed.error);
    throw new Error("Invalid recipe data");
  }
  console.log("[createRecipe] parsed data:", parsed.data);
  const id = nanoid();
  const { authorId, ...rest } = parsed.data; void authorId;
  const [recipe] = await db.insert(recipes).values({ ...rest, id }).returning();
  console.log("[createRecipe] inserted recipe:", recipe);
  return recipe;
}

export async function getRecipeById(id: string) {
  return db.query.recipes.findFirst({ where: eq(recipes.id, id) });
}

export async function getRecipeBySlug(slug: string) {
  const recipe = await db.query.recipes.findFirst({ 
    where: eq(recipes.slug, slug) 
  });
  
  if (!recipe) return null;
  
  // Ensure images is always an array
  return {
    ...recipe,
    images: Array.isArray(recipe.images) ? recipe.images : [],
    featured: !!recipe.featured,
    published: !!recipe.published,
    trending: !!recipe.trending,
  };
}

export async function updateRecipe(id: string, input: Partial<Omit<Recipe, "id" | "createdAt" | "updatedAt">>) {
  console.log("[updateRecipe] input:", input);
  const parsed = recipeSchema.partial().omit({ id: true, createdAt: true, updatedAt: true }).safeParse(input);
  
  if (!parsed.success) {
    console.error("[updateRecipe] validation error:", parsed.error.format());
    
    // Extract error messages in a more readable format
    const errorDetails = Object.entries(parsed.error.format())
      .filter(([key]) => key !== '_errors')
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          // value is string[]
          return value.length > 0 ? `${key}: ${value.join(', ')}` : null;
        }
        if (value && typeof value === 'object' && '_errors' in value && Array.isArray(value._errors)) {
          return value._errors.length > 0 ? `${key}: ${value._errors.join(', ')}` : null;
        }
        return null;
      })
      .filter(Boolean)
      .join('; ');
    
    throw new Error(`Invalid recipe data: ${errorDetails || 'Validation failed'}`);
  }
  
  console.log("[updateRecipe] parsed data:", parsed.data);
  const [recipe] = await db.update(recipes).set(parsed.data).where(eq(recipes.id, id)).returning();
  console.log("[updateRecipe] updated recipe:", recipe);
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

  // Evaluate the where clause with Drizzle helpers
  const whereClause = (recipes: any, helpers: any) => {
    const conditions = [];
    if (search) {
      const s = `%${search.toLowerCase()}%`;
      conditions.push(helpers.or(helpers.ilike(recipes.title, s), helpers.ilike(recipes.slug, s)));
    }
    if (filter === 'published') conditions.push(helpers.eq(recipes.published, true));
    if (filter === 'draft') conditions.push(helpers.eq(recipes.published, false));
    if (filter === 'featured') conditions.push(helpers.eq(recipes.featured, true));
    if (conditions.length === 0) return undefined;
    if (conditions.length === 1) return conditions[0];
    return conditions.reduce((a, b) => a && b);
  };

  // Get total count
  const totalResult = await db.query.recipes.findMany({
    where: (recipes: any, helpers: any) => whereClause(recipes, helpers),
    columns: { id: true },
  });
  const total = totalResult.length;

  // Fetch paginated recipes
  const orderBy = sort === 'title' ? recipes.title : recipes.createdAt;
  const paginated = await db.query.recipes.findMany({
    where: (recipes: any, helpers: any) => whereClause(recipes, helpers),
    orderBy: (recipes: any, { asc, desc }: any) => [sortDir === 'asc' ? asc(orderBy) : desc(orderBy)],
    limit: pageSize,
    offset,
  });
  return { recipes: paginated, total };
}

/**
 * Fetch top 6 featured or trending recipes for homepage carousel
 */
export async function getFeaturedRecipes() {
  const featured = await db.query.recipes.findMany({
    where: (recipe, { eq, and }) =>
      and(eq(recipe.featured, true), eq(recipe.published, true)),
    limit: 6,
    orderBy: (recipe, { desc }) => [desc(recipe.createdAt)],
  });
  // Always return images as an array
  return featured.map(recipe => ({
    ...recipe,
    images: Array.isArray(recipe.images) ? recipe.images : [],
  }));
}

export async function getTrendingRecipes(limit = 12) {
  return db.query.recipes.findMany({
    where: (recipe, { eq }) => eq(recipe.trending, true),
    orderBy: (recipe, { desc }) => [desc(recipe.createdAt)],
    limit,
  });
}

export async function getMostSavedRecipes(limit = 12) {
  // Interpolate limit directly (safe, not user input)
  const result = await db.execute(
    `SELECT r.*, COUNT(sr.recipe_id) as saves
     FROM recipe r
     JOIN saved_recipe sr ON r.id = sr.recipe_id
     GROUP BY r.id
     ORDER BY saves DESC, r.created_at DESC
     LIMIT ${limit}`
  );
  return result.rows;
}

export async function setRecipeTrending(id: string, trending: boolean) {
  const [recipe] = await db.update(recipes).set({ trending }).where(eq(recipes.id, id)).returning();
  return recipe;
}

export async function setRecipeFeatured(id: string, featured: boolean) {
  const [recipe] = await db.update(recipes).set({ featured }).where(eq(recipes.id, id)).returning();
  return recipe;
} 