"use server";

import { nanoid } from "nanoid";
import db from "../../../db/drizzle";
import { reviews } from "../../../db/schema";
import { reviewSchema, type Review } from "../validation";
import { eq } from "drizzle-orm";

export async function createReview(input: Omit<Review, "id" | "createdAt" | "updatedAt">) {
  const parsed = reviewSchema.omit({ id: true, createdAt: true, updatedAt: true }).safeParse(input);
  if (!parsed.success) throw new Error("Invalid review data");
  const id = nanoid();
  const [review] = await db.insert(reviews).values({ ...parsed.data, id }).returning();
  return review;
}

export async function getReviewById(id: string) {
  return db.query.reviews.findFirst({ where: eq(reviews.id, id) });
}

export async function updateReview(id: string, input: Partial<Omit<Review, "id" | "createdAt" | "updatedAt">>) {
  const parsed = reviewSchema.partial().omit({ id: true, createdAt: true, updatedAt: true }).safeParse(input);
  if (!parsed.success) throw new Error("Invalid review data");
  const [review] = await db.update(reviews).set(parsed.data).where(eq(reviews.id, id)).returning();
  return review;
}

export async function deleteReview(id: string) {
  await db.delete(reviews).where(eq(reviews.id, id));
  return { success: true };
} 