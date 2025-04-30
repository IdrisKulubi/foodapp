"use server";

import db from "../../../db/drizzle";
import { comments } from "../../../db/schema";
import { commentSchema, type Comment } from "../validation";
import { eq } from "drizzle-orm";

export async function createComment(input: Omit<Comment, "id" | "createdAt" | "updatedAt">) {
  const parsed = commentSchema.omit({ id: true, createdAt: true, updatedAt: true }).safeParse(input);
  if (!parsed.success) throw new Error("Invalid comment data");
  const [comment] = await db.insert(comments).values(parsed.data).returning();
  return comment;
}

export async function getCommentById(id: string) {
  return db.query.comments.findFirst({ where: eq(comments.id, id) });
}

export async function updateComment(id: string, input: Partial<Omit<Comment, "id" | "createdAt" | "updatedAt">>) {
  const parsed = commentSchema.partial().omit({ id: true, createdAt: true, updatedAt: true }).safeParse(input);
  if (!parsed.success) throw new Error("Invalid comment data");
  const [comment] = await db.update(comments).set(parsed.data).where(eq(comments.id, id)).returning();
  return comment;
}

export async function deleteComment(id: string) {
  await db.delete(comments).where(eq(comments.id, id));
  return { success: true };
} 