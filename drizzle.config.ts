import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
import { environment } from './src/environments/environment';

dotenv.config();

export default {
  schema: './src/app/lib/drizzle/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: environment.SUPABASE_DB_URL,
  },
} satisfies Config;
