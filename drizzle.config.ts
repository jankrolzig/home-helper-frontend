import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export default defineConfig({
  schema: './libs/drizzle/schema/*.ts',
  out: './libs/drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env['SUPABASE_DB_URL']!,
    ssl: true,
  },
});
