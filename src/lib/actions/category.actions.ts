"use server";

import db from "../../../db/drizzle";
import { categories } from "../../../db/schema";
import { categorySchema, type Category } from "../validation";
import { eq } from "drizzle-orm";

export async function createCategory(input: Omit<Category, "id">) {
  const parsed = categorySchema.omit({ id: true }).safeParse(input);
  if (!parsed.success) throw new Error("Invalid category data");
  const [category] = await db.insert(categories).values(parsed.data).returning();
  return category;
}

export async function getCategoryById(id: string) {
  return db.query.categories.findFirst({ where: eq(categories.id, id) });
}

export async function updateCategory(id: string, input: Partial<Omit<Category, "id">>) {
  const parsed = categorySchema.partial().omit({ id: true }).safeParse(input);
  if (!parsed.success) throw new Error("Invalid category data");
  const [category] = await db.update(categories).set(parsed.data).where(eq(categories.id, id)).returning();
  return category;
}

export async function deleteCategory(id: string) {
  await db.delete(categories).where(eq(categories.id, id));
  return { success: true };
}

export async function getAllCategories() {
  return db.select().from(categories);
} 