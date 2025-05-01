"use server";

import db from "../../../db/drizzle";
import { categories } from "../../../db/schema";
import { categorySchema, type Category } from "../validation";
import { eq, or, ilike, asc, desc, sql } from "drizzle-orm";
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
  const where = search
    ? or(
        ilike(categories.name, `%${search}%`),
        ilike(categories.slug, `%${search}%`)
      )
    : undefined;
  const orderBy = [
    sortDir === 'asc' ? asc(categories[sort]) : desc(categories[sort])
  ];
  const [totalResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(categories)
    .where(where)
    .execute();
  const total = Number(totalResult?.count ?? 0);
  const cats = await db
    .select()
    .from(categories)
    .where(where)
    .orderBy(...orderBy)
    .limit(pageSize)
    .offset(offset)
    .execute();
  return { categories: cats, total };
} 