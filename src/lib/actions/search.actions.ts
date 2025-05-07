"use server";

import db from "@/db/drizzle";
import { ilike, or } from "drizzle-orm";

export async function searchRecipes(query: string) {
  if (!query) return [];
  // Search by title or description, limit 8
  return db.query.recipes.findMany({
    where: (recipe) =>
      or(
        ilike(recipe.title, `%${query}%`),
        ilike(recipe.description, `%${query}%`)
      ),
    columns: {
      id: true,
      title: true,
      description: true,
      slug: true,
    },
    limit: 8,
  });
} 