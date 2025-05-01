/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import db from "../../../db/drizzle";
import { tags } from "../../../db/schema";
import { tagSchema, type Tag } from "../validation";
import { eq } from "drizzle-orm";
import { nanoid } from 'nanoid';

export async function createTag(input: Omit<Tag, "id">) {
  const parsed = tagSchema.omit({ id: true }).safeParse(input);
  if (!parsed.success) throw new Error("Invalid tag data");
  const id = nanoid();
  const [tag] = await db.insert(tags).values({ ...parsed.data, id }).returning();
  return tag;
}

export async function getTagById(id: string) {
  return db.query.tags.findFirst({ where: eq(tags.id, id) });
}

export async function updateTag(id: string, input: Partial<Omit<Tag, "id">>) {
  const parsed = tagSchema.partial().omit({ id: true }).safeParse(input);
  if (!parsed.success) throw new Error("Invalid tag data");
  const [tag] = await db.update(tags).set(parsed.data).where(eq(tags.id, id)).returning();
  return tag;
}

export async function deleteTag(id: string) {
  await db.delete(tags).where(eq(tags.id, id));
  return { success: true };
}

export async function getAllTags() {
  return db.select().from(tags);
}

/**
 * Fetch paginated tags for admin dashboard
 * @param page 1-based page number
 * @param pageSize number of tags per page
 * @param search search term (optional)
 * @returns { tags: Tag[], total: number }
 */
export async function getPaginatedTags({
  page = 1,
  pageSize = 24,
  search = '',
}: {
  page?: number
  pageSize?: number
  search?: string
}) {
  const offset = (page - 1) * pageSize;
  let where = undefined;
  if (search) {
    const s = `%${search.toLowerCase()}%`;
    where = (tags: any, { ilike, or }: any) =>
      or(ilike(tags.name, s), ilike(tags.slug, s));
  }
  // Get total count
  const totalResult = await db.query.tags.findMany({
    where,
    columns: { id: true },
  });
  const total = totalResult.length;
  // Fetch paginated tags
  const paginated = await db.query.tags.findMany({
    where,
    orderBy: (tags: any, { asc }: any) => [asc(tags.name)],
    limit: pageSize,
    offset,
  });
  return { tags: paginated, total };
} 