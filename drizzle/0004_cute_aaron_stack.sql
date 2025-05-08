ALTER TABLE "recipe" ADD COLUMN "ingredients" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "recipe" ADD COLUMN "steps" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "recipe" ADD COLUMN "instructions" text;--> statement-breakpoint
ALTER TABLE "recipe" ADD COLUMN "notes" text;