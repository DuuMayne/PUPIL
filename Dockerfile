# syntax=docker/dockerfile:1.7

# ---------- base ----------
# Node 22 (current LTS) — also satisfies lint-staged's own >=22.22.1 floor,
# which otherwise prints an EBADENGINE warning during npm ci.
FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat

# ---------- deps ----------
# Install build toolchain so better-sqlite3 can compile its native module
# on architectures where no prebuilt binary is available (e.g. arm64/musl).
FROM base AS deps
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY package.json package-lock.json ./
# Skip husky's `prepare` script — git hooks are meaningless inside a
# throwaway build container and there's no .git checkout to hook into here.
ENV HUSKY=0
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

# Standalone Next output bundles only what's needed to run. No `public/`
# copy here — this app has no static assets (removed when the repo was
# cleaned up for public presentation); add one back if that ever changes.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV DB_PATH=/app/data/pupil.db

CMD ["node", "server.js"]
