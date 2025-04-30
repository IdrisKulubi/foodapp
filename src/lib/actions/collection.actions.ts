"use server";

import db from "../../../db/drizzle";
import { collections } from "../../../db/schema";
import { collectionSchema, type Collection } from "../validation";
import { eq } from "drizzle-orm";

export async function createCollection(input: Omit<Collection, "id" | "createdAt" | "updatedAt">) {
  const parsed = collectionSchema.omit({ id: true, createdAt: true, updatedAt: true }).safeParse(input);
  if (!parsed.success) throw new Error("Invalid collection data");
  const [collection] = await db.insert(collections).values(parsed.data).returning();
  return collection;
}

export async function getCollectionById(id: string) {
  return db.query.collections.findFirst({ where: eq(collections.id, id) });
}

export async function updateCollection(id: string, input: Partial<Omit<Collection, "id" | "createdAt" | "updatedAt">>) {
  const parsed = collectionSchema.partial().omit({ id: true, createdAt: true, updatedAt: true }).safeParse(input);
  if (!parsed.success) throw new Error("Invalid collection data");
  const [collection] = await db.update(collections).set(parsed.data).where(eq(collections.id, id)).returning();
  return collection;
}

export async function deleteCollection(id: string) {
  await db.delete(collections).where(eq(collections.id, id));
  return { success: true };
} 