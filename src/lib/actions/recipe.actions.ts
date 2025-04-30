"use server";

import db from "../../../db/drizzle";
import { recipes } from "../../../db/schema";
import { recipeSchema, type Recipe } from "../validation";
import { eq } from "drizzle-orm";

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
  return { success: true };
} 