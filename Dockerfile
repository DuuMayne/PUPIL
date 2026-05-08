# syntax=docker/dockerfile:1.7

# ---------- base ----------
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat

# ---------- deps ----------
# Install build toolchain so better-sqlite3 can compile its native module
# on architectures where no prebuilt binary is available (e.g. arm64/musl).
FROM base AS deps
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY package.json package-lock.json ./
RUN npm ci

# ---------- builder ----------
FROM base AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---------- runner ----------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# Default DB location — override DB_PATH at runtime to point at a mounted volume.
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data

# Standalone Next output bundles only what's needed to run.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV DB_PATH=/app/data/pupil.db

CMD ["node", "server.js"]
