ALTER TABLE "edi_transactions" RENAME COLUMN "content" TO "edi_string";--> statement-breakpoint
ALTER TABLE "edi_transactions" ALTER COLUMN "edi_string" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "edi_transactions" DROP COLUMN IF EXISTS "content_xml";