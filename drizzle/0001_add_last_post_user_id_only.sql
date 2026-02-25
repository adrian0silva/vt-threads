-- Add last_post_user_id to thread (nullable FK to user)
ALTER TABLE "thread" ADD COLUMN IF NOT EXISTS "last_post_user_id" text;--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'thread_last_post_user_id_user_id_fk' AND table_name = 'thread'
  ) THEN
    ALTER TABLE "thread" ADD CONSTRAINT "thread_last_post_user_id_user_id_fk" FOREIGN KEY ("last_post_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
  END IF;
END $$;--> statement-breakpoint
-- Backfill: set last_post_user_id from most recent post per thread
UPDATE thread t
SET last_post_user_id = (
  SELECT p.user_id FROM post p WHERE p.thread_id = t.id ORDER BY p.created_at DESC LIMIT 1
)
WHERE t.last_post_user_id IS NULL AND EXISTS (SELECT 1 FROM post p WHERE p.thread_id = t.id);
