import { execSync } from 'child_process';
import { prisma } from './database.js';

export async function ensureDatabaseReady() {
  try {
    // Ensure DATABASE_URL is set
    const dbUrl = process.env.DATABASE_URL || 'file:./dev.db';
    process.env.DATABASE_URL = dbUrl;

    console.log(`🔄 Checking database schema at ${dbUrl}...`);
    execSync('npx prisma db push --skip-generate', {
      stdio: 'inherit',
      env: {
        ...process.env,
        DATABASE_URL: dbUrl,
      },
    });

    // Check if database has been seeded
    const adminCount = await prisma.admin.count().catch(() => 0);
    if (adminCount === 0) {
      console.log('🌱 First boot detected: running automated menu & admin seeding...');
      execSync('npx tsx prisma/seed.ts', {
        stdio: 'inherit',
        env: {
          ...process.env,
          DATABASE_URL: dbUrl,
        },
      });
      console.log('🎉 Database automatically initialized and seeded successfully!');
    } else {
      console.log(`✅ Database ready (${adminCount} admin account(s) active).`);
    }
  } catch (err: any) {
    console.warn('⚠️ Automated database setup notice:', err?.message || err);
  }
}
