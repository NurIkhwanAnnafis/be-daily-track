ALTER TABLE "categories" RENAME COLUMN "type_id" TO "type_ids";--> statement-breakpoint
ALTER TABLE "categories" DROP CONSTRAINT "categories_type_id_category_type_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "categories_type_index";--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "type_ids" TYPE integer[] USING ARRAY["type_ids"]::integer[];--> statement-breakpoint
CREATE INDEX "categories_type_index" ON "categories" USING gin ("type_ids");