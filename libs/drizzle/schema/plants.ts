import { boolean, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const plants = pgTable('plants', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  scientificName: text('scientific_name'),
  description: text('description'),
  wateringFrequency: integer('watering_frequency').notNull(),
  sunlight: text('sunlight').notNull().default('partial'),
  humidity: integer('humidity').notNull(),
  temperatureMin: integer('temperature_min').notNull(),
  temperatureMax: integer('temperature_max').notNull(),
  difficulty: text('difficulty').notNull().default('medium'),
  imageUrl: text('image_url'),
  isFavorite: boolean('is_favorite').notNull().default(false),
  lastWatered: timestamp('last_watered'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Plant = typeof plants.$inferSelect;
export type NewPlant = typeof plants.$inferInsert;
