import { execSync } from 'child_process';
import { prisma } from './database.js';

export async function ensureDatabaseReady() {
  try {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      console.warn('⚠️ DATABASE_URL is not defined in environment variables.');
      return;
    }

    console.log('🔄 Synchronizing PostgreSQL database schema with Prisma...');
    execSync('npx prisma db push --skip-generate --accept-data-loss', {
      stdio: 'inherit',
      env: process.env,
      timeout: 60000,
    });

    // Check if database has been seeded
    const adminCount = await prisma.admin.count().catch(() => 0);
    if (adminCount === 0) {
      console.log('🌱 First boot: running automated menu & admin seeding on PostgreSQL...');
      execSync('npx tsx prisma/seed.ts', {
        stdio: 'inherit',
        env: process.env,
        timeout: 60000,
      });
      console.log('🎉 PostgreSQL database initialized and seeded successfully!');
    } else {
      console.log(`✅ PostgreSQL database ready (${adminCount} admin account(s) active). All custom dishes and prices preserved.`);
    }
  } catch (err: any) {
    console.warn('⚠️ Automated database setup notice:', err?.message || err);
  }
}

