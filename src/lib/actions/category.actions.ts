/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import db from "../../../db/drizzle";
import { categories } from "../../../db/schema";
import { categorySchema, type Category } from "../validation";
import { eq } from "drizzle-orm";
import { nanoid } from 'nanoid';

export async function createCategory(input: Omit<Category, "id">) {
  const parsed = categorySchema.omit({ id: true }).safeParse(input);
  if (!parsed.success) throw new Error("Invalid category data");
  const id = nanoid();
  const [category] = await db.insert(categories).values({ ...parsed.data, id }).returning();
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

export async function getPaginatedCategories({
  page = 1,
  pageSize = 24,
  search = '',
  sort = 'name',
  sortDir = 'asc',
}: {
  page?: number
  pageSize?: number
  search?: string
  sort?: 'name' | 'slug'
  sortDir?: 'asc' | 'desc'
}) {
  const offset = (page - 1) * pageSize;

  // Evaluate the where clause with Drizzle helpers
  const whereClause = (categories: any, helpers: any) => {
    if (!search) return undefined;
    const s = `%${search.toLowerCase()}%`;
    return helpers.or(
      helpers.ilike(categories.name, s),
      helpers.ilike(categories.slug, s)
    );
  };

  // Get total count
  const totalResult = await db.query.categories.findMany({
    where: (categories: any, helpers: any) => whereClause(categories, helpers),
    columns: { id: true },
  });
  const total = totalResult.length;

  // Fetch paginated categories
  const orderBy = sort === 'slug' ? categories.slug : categories.name;
  const paginated = await db.query.categories.findMany({
    where: (categories: any, helpers: any) => whereClause(categories, helpers),
    orderBy: (categories: any, { asc, desc }: any) => [sortDir === 'asc' ? asc(orderBy) : desc(orderBy)],
    limit: pageSize,
    offset,
  });
  return { categories: paginated, total };
} 