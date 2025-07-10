ALTER TABLE `jobs` RENAME COLUMN "processed_at" TO "processed_done_at";--> statement-breakpoint
ALTER TABLE `jobs` DROP COLUMN `updated_at`;--> statement-breakpoint
ALTER TABLE `api_keys` ADD `nickname` text NOT NULL;