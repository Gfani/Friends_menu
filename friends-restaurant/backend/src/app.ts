import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import path from 'path';
import fs from 'fs';
import { env } from './config/env.js';
import { authRoutes } from './routes/auth.routes.js';
import { menuRoutes } from './routes/menu.routes.js';
import { settingsRoutes } from './routes/settings.routes.js';

const app = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  },
});

async function main() {
  // Ensure uploads directory exists
  const uploadsPath = path.resolve(process.cwd(), env.UPLOAD_DIR);
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
  }

  // Register plugins
  await app.register(cors, {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  await app.register(jwt, {
    secret: env.JWT_SECRET,
  });

  await app.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
  });

  await app.register(fastifyStatic, {
    root: uploadsPath,
    prefix: '/uploads/',
  });

  // Healthcheck
  app.get('/api/health', async () => {
    return {
      status: 'ok',
      restaurant: 'F.R.I.E.N.D.S (Mereba Friends Garden)',
      tagline: "We'll be there for you.",
      timestamp: new Date().toISOString(),
    };
  });

  // Register Routes
  await app.register(authRoutes, { prefix: '/api/auth' });
  await app.register(menuRoutes, { prefix: '/api' });
  await app.register(settingsRoutes, { prefix: '/api' });

  // Listen
  try {
    await app.listen({ port: env.PORT, host: env.HOST });
    console.log(`☕ F.R.I.E.N.D.S Server running at http://${env.HOST}:${env.PORT}`);
    console.log(`📋 API Health: http://${env.HOST}:${env.PORT}/api/health`);
    console.log(`🍽️ Menu API: http://${env.HOST}:${env.PORT}/api/menu`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();

export default app;

