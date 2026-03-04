CREATE TABLE "transaction_status" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"merchant_name" varchar(255) NOT NULL,
	"description" text,
	"amount" numeric NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"user_id" uuid NOT NULL,
	"type_id" uuid NOT NULL,
	"status_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "users_config" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"config" jsonb DEFAULT '{"expense":{"limit_per_day":0,"limit_per_month":0},"income":{"limit_per_day":0,"limit_per_month":0}}'::jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "category_type" DROP CONSTRAINT "category_type_organization_id_organizations_id_fk";
--> statement-breakpoint
DROP INDEX "category_type_org_index";--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_type_id_category_type_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."category_type"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_status_id_transaction_status_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."transaction_status"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_config" ADD CONSTRAINT "users_config_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "transactions_type_index" ON "transactions" USING btree ("type_id");--> statement-breakpoint
CREATE INDEX "transactions_user_index" ON "transactions" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "category_type" DROP COLUMN "organization_id";