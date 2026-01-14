import { json, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const plants = pgTable('plants', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  name: text('name').notNull(),
  scientificName: text('scientific_name'),
  commonNames: json('common_names').$type<string[]>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Plant = typeof plants.$inferSelect;
export type NewPlant = typeof plants.$inferInsert;
export type PlantWithImage = Plant & {
  plant_images: {
    id: string;
    url: string;
  }[];
};
