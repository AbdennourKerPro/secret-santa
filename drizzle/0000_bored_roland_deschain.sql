CREATE TABLE "assignment" (
	"santa_id" uuid NOT NULL,
	"giver_id" uuid PRIMARY KEY NOT NULL,
	"receiver_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "participant" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"santa_id" uuid NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"token_hash" text,
	"email_sent_at" timestamp with time zone,
	"opened_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "participant_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "santa" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"exchange_date" date NOT NULL,
	"budget" integer NOT NULL,
	"currency" text DEFAULT 'EUR' NOT NULL,
	"message" text DEFAULT '' NOT NULL,
	"organizer_name" text NOT NULL,
	"organizer_email" text NOT NULL,
	"organizer_token_hash" text NOT NULL,
	"drawn_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "santa_organizer_token_hash_unique" UNIQUE("organizer_token_hash")
);
--> statement-breakpoint
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_santa_id_santa_id_fk" FOREIGN KEY ("santa_id") REFERENCES "public"."santa"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_giver_id_participant_id_fk" FOREIGN KEY ("giver_id") REFERENCES "public"."participant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_receiver_id_participant_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."participant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "participant" ADD CONSTRAINT "participant_santa_id_santa_id_fk" FOREIGN KEY ("santa_id") REFERENCES "public"."santa"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "participant_santa_idx" ON "participant" USING btree ("santa_id");