CREATE TABLE "transaction_types" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_type_id_category_type_id_fk";
--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN "type_id";
--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "type_id" integer NOT NULL DEFAULT 0;
--> statement-breakpoint
ALTER TABLE "category_type" DROP CONSTRAINT "category_type_pkey";
--> statement-breakpoint
ALTER TABLE "category_type" DROP COLUMN "id";
--> statement-breakpoint
ALTER TABLE "category_type" ADD COLUMN "id" integer PRIMARY KEY NOT NULL;
--> statement-breakpoint
ALTER TABLE "transactions" DROP COLUMN "type_id";
--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "type_id" integer NOT NULL DEFAULT 0;
--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "category_id" uuid NOT NULL;
--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_type_id_transaction_types_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."transaction_types"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_type_id_category_type_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."category_type"("id") ON DELETE no action ON UPDATE no action;