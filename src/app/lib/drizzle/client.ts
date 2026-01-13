import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { environment } from '../../../environments/environment';

export const connectionString = environment.supabaseUrl;
export const client = postgres(connectionString);
export const db = drizzle(client, { schema });
