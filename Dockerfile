# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# --- Dépendances ---
FROM base AS deps
COPY package.json package-lock.json ./
# --include=dev : Coolify peut injecter NODE_ENV=production au build, ce qui ferait sauter
# les devDependencies nécessaires au build (typescript, tailwind, prisma...).
RUN npm ci --include=dev

# --- Build ---
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# --- Outils de migration (CLI Prisma isolée, hors bundle standalone) ---
FROM base AS migrate
WORKDIR /app/migrate
COPY package.json package-lock.json ./
RUN PRISMA_VERSION=$(node -p "require('./package-lock.json').packages['node_modules/prisma'].version") \
    && DOTENV_VERSION=$(node -p "require('./package-lock.json').packages['node_modules/dotenv'].version") \
    && rm package.json package-lock.json \
    && npm init -y >/dev/null \
    && npm pkg set type=module \
    && npm install --omit=dev --no-audit --no-fund "prisma@${PRISMA_VERSION}" "dotenv@${DOTENV_VERSION}"
COPY prisma ./prisma
COPY prisma.config.ts ./

# --- Image finale ---
FROM base AS runner
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=migrate --chown=nextjs:nodejs /app/migrate ./migrate
COPY --chown=nextjs:nodejs docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD wget -qO- "http://127.0.0.1:${PORT}/api/health" >/dev/null || exit 1

ENTRYPOINT ["./docker-entrypoint.sh"]
