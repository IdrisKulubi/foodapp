import { z } from "zod";

// User Schema
export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(["user", "admin"]).default("user"),
  emailVerified: z.date().optional().nullable(),
  image: z.string().url().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export type User = z.infer<typeof userSchema>;

// Recipe Schema
export const recipeSchema = z.object({
  id: z.string(),
  authorId: z.string().optional().nullable(),
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional().nullable(),
  prepTime: z.number().int().nonnegative().optional().nullable(),
  cookTime: z.number().int().nonnegative().optional().nullable(),
  totalTime: z.number().int().nonnegative().optional().nullable(),
  servings: z.number().int().positive().optional().nullable(),
  difficultyLevel: z.string().optional().nullable(),
  featured: z.boolean().optional(),
  trending: z.boolean().optional(),
  published: z.boolean().optional(),
  publishedAt: z.date().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  images: z.array(z.string()).optional().default([]),
  ingredients: z.array(z.object({
    name: z.string().min(1),
    quantity: z.string().min(1),
    unit: z.string().optional(),
    note: z.string().optional(),
  })).default([]),
  steps: z.array(z.object({
    order: z.number().int().nonnegative(),
    description: z.string().min(1),
    imageUrl: z.string().optional(),
  })).default([]),
  instructions: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  categoryIds: z.array(z.string()).optional().default([]),
  tagIds: z.array(z.string()).optional().default([]),
});
export type Recipe = z.infer<typeof recipeSchema>;

// Category Schema
export const categorySchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
});
export type Category = z.infer<typeof categorySchema>;

// Tag Schema
export const tagSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  slug: z.string().min(1),
});
export type Tag = z.infer<typeof tagSchema>;

// Review Schema
export const reviewSchema = z.object({
  id: z.string(),
  recipeId: z.string(),
  userId: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export type Review = z.infer<typeof reviewSchema>;

// Comment Schema
export const commentSchema = z.object({
  id: z.string(),
  recipeId: z.string(),
  userId: z.string(),
  content: z.string().min(1),
  parentId: z.string().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export type Comment = z.infer<typeof commentSchema>;

// Collection Schema
export const collectionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  isPublic: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export type Collection = z.infer<typeof collectionSchema>; 