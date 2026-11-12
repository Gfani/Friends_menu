# ========================================================
# MEREBA FRIENDS GARDEN (መረባ ፍሬንድስ)
# Multi-Stage Production Docker Container for Azure
# ========================================================

# --------------------------------------------------------
# Stage 1: Build the React Frontend SPA
# --------------------------------------------------------
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# --------------------------------------------------------
# Stage 2: Build the Fastify Backend & Prisma Client
# --------------------------------------------------------
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend

# Install OpenSSL for Prisma engine on Alpine
RUN apk add --no-cache openssl libc6-compat

COPY backend/package*.json ./
COPY backend/prisma ./prisma/
RUN npm ci
RUN npx prisma generate

COPY backend/ ./
RUN npm run build

# --------------------------------------------------------
# Stage 3: Minimal Production Runtime
# --------------------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

# Set production environment flags
ENV NODE_ENV=production
ENV PORT=5000
ENV HOST=0.0.0.0
ENV FRONTEND_DIST=/app/frontend-dist
ENV DATABASE_URL="file:./prisma/dev.db"
ENV UPLOAD_DIR="./uploads"

# Install OpenSSL for Prisma SQLite runtime
RUN apk add --no-cache openssl libc6-compat dumb-init

# Copy backend dependencies, compiled code, and Prisma database
COPY --from=backend-builder /app/backend/node_modules ./node_modules
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=backend-builder /app/backend/prisma ./prisma
COPY --from=backend-builder /app/backend/package*.json ./

# Copy compiled frontend SPA
COPY --from=frontend-builder /app/frontend/dist /app/frontend-dist

# Create uploads directory for image uploads
RUN mkdir -p /app/uploads

# Expose port (Azure Web Apps maps WEBSITES_PORT=5000)
EXPOSE 5000

# Use dumb-init to properly handle PID 1 signals
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Start server
CMD ["node", "dist/app.js"]

