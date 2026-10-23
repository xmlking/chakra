CREATE TABLE "inbox_presence" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"user_id" uuid NOT NULL UNIQUE,
	"last_seen_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification_delivery" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"notification_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"channel" text NOT NULL,
	"status" text NOT NULL,
	"scheduled_for" timestamp NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"claimed_at" timestamp,
	"sent_at" timestamp,
	"detail" text,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "notification" ADD COLUMN "seen_at" timestamp;--> statement-breakpoint
ALTER TABLE "inbox_presence" ADD CONSTRAINT "inbox_presence_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "notification_delivery" ADD CONSTRAINT "notification_delivery_notification_id_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "notification"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "notification_delivery" ADD CONSTRAINT "notification_delivery_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;