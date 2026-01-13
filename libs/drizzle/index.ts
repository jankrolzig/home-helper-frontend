import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = postgres(process.env['SUPABASE_DB_URL']!, { prepare: false });
export const db = drizzle(client, { schema, logger: true });

export * from './schema';
export type { Plant, NewPlant } from './schema';
