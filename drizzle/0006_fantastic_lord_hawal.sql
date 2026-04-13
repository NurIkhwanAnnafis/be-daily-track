CREATE TABLE "category_category_type" (
	"category_id" uuid NOT NULL,
	"type_id" integer NOT NULL,
	CONSTRAINT "category_category_type_category_id_type_id_pk" PRIMARY KEY("category_id","type_id")
);
--> statement-breakpoint
ALTER TABLE "categories" DROP CONSTRAINT IF EXISTS "categories_type_ids_category_type_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "categories_type_index";--> statement-breakpoint
ALTER TABLE "category_category_type" ADD CONSTRAINT "category_category_type_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category_category_type" ADD CONSTRAINT "category_category_type_type_id_category_type_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."category_type"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "category_category_type_category_index" ON "category_category_type" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "category_category_type_type_index" ON "category_category_type" USING btree ("type_id");--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN IF EXISTS "type_ids";