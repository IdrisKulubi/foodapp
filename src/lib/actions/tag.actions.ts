"use server";

import db from "../../../db/drizzle";
import { tags } from "../../../db/schema";
import { tagSchema, type Tag } from "../validation";
import { eq } from "drizzle-orm";

export async function createTag(input: Omit<Tag, "id">) {
  const parsed = tagSchema.omit({ id: true }).safeParse(input);
  if (!parsed.success) throw new Error("Invalid tag data");
  const [tag] = await db.insert(tags).values(parsed.data).returning();
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