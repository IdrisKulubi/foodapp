ALTER TABLE "recipe" DROP CONSTRAINT "recipe_author_id_user_id_fk";
--> statement-breakpoint
DROP INDEX "recipe_author_idx";--> statement-breakpoint
ALTER TABLE "recipe" DROP COLUMN "author_id";