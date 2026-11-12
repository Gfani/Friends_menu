# ========================================================
# MEREBA FRIENDS GARDEN (መረባ ፍሬንድስ)
# Multi-Stage Production Docker Container for Azure
# ========================================================

# --------------------------------------------------------
# Stage 1: Build the React Frontend SPA
# --------------------------------------------------------
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY friends-restaurant/frontend/package*.json ./
RUN npm ci

COPY friends-restaurant/frontend/ ./
RUN npm run build

# --------------------------------------------------------
# Stage 2: Build the Fastify Backend & Prisma Client
# --------------------------------------------------------
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend

RUN apk add --no-cache openssl libc6-compat

COPY friends-restaurant/backend/package*.json ./
COPY friends-restaurant/backend/prisma ./prisma/
RUN npm ci
RUN npx prisma generate

COPY friends-restaurant/backend/ ./
RUN npm run build

# --------------------------------------------------------
# Stage 3: Minimal Production Runtime
# --------------------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000
ENV HOST=0.0.0.0
ENV FRONTEND_DIST=/app/frontend-dist
ENV DATABASE_URL="file:./prisma/dev.db"
ENV UPLOAD_DIR="./uploads"

RUN apk add --no-cache openssl libc6-compat dumb-init

COPY --from=backend-builder /app/backend/node_modules ./node_modules
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=backend-builder /app/backend/prisma ./prisma
COPY --from=backend-builder /app/backend/package*.json ./

COPY --from=frontend-builder /app/frontend/dist /app/frontend-dist

RUN mkdir -p /app/uploads

EXPOSE 5000

ENTRYPOINT ["/usr/bin/dumb-init", "--"]

CMD ["node", "dist/app.js"]
