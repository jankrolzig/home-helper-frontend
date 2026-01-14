import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { plants } from './plants';

export const plantImages = pgTable('plant_images', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  plantId: uuid('plant_id')
    .notNull()
    .references(() => plants.id, { onDelete: 'cascade' }),
  path: text('path').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type PlantImage = typeof plantImages.$inferSelect;
export type NewPlantImage = typeof plantImages.$inferInsert;
