import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const apiKeys = sqliteTable('api_keys', {
  id: integer('id').primaryKey(),
  key: text('key').notNull(),
  nickname: text('nickname').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const jobs = sqliteTable('jobs', {
  id: integer('id').primaryKey(),
  apiKeyId: integer('api_key_id')
    .notNull()
    .references(() => apiKeys.id),
  status: text('status').notNull(),
  command: text('command').notNull(),
  error: text('error'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  processedDoneAt: integer('processed_done_at', {
    mode: 'timestamp',
  }).notNull(),
});

export type Job = typeof jobs.$inferInsert;
export type APIKey = typeof apiKeys.$inferSelect;
