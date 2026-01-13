import postgres from 'postgres';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

async function main() {
  const client = postgres(process.env['SUPABASE_DB_URL']!, {
    max: 1,
    prepare: false,
  });

  console.log('🚀 Running migrations...');

  try {
    // Create migration table in public schema
    await client`
      CREATE TABLE IF NOT EXISTS public.__drizzle_migrations (
        id SERIAL PRIMARY KEY,
        hash text NOT NULL,
        created_at bigint
      )
    `;

    console.log('✅ Migration table created/verified');

    // Get all migration files
    const migrationsDir = path.join(process.cwd(), 'libs/drizzle/migrations');
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    console.log(`📁 Found ${migrationFiles.length} migration files`);

    // Get applied migrations
    const appliedMigrations = await client`
      SELECT hash FROM public.__drizzle_migrations
    `;
    const appliedHashes = new Set(appliedMigrations.map((m: any) => m.hash));

    // Apply new migrations
    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const hash = require('crypto').createHash('sha256').update(content).digest('hex');

      if (!appliedHashes.has(hash)) {
        console.log(`📝 Applying: ${file}`);

        // Execute migration
        await client.unsafe(content);

        // Record migration
        await client`
          INSERT INTO public.__drizzle_migrations (hash, created_at)
          VALUES (${hash}, ${Date.now()})
        `;

        console.log(`✅ Applied: ${file}`);
      } else {
        console.log(`⏭️  Skipped (already applied): ${file}`);
      }
    }

    console.log('🎉 All migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
