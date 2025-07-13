# ---------- deps ----------
FROM node:20-alpine AS deps
WORKDIR /app

RUN corepack enable && corepack prepare yarn@4.9.2 --activate

COPY package.json yarn.lock turbo.json .yarnrc.yml .yarn/ ./

# Copy all workspace manifests so Yarn can resolve them
COPY apps/backend/package.json apps/backend/
COPY apps/frontend/package.json apps/frontend/
COPY packages/shared/package.json packages/shared/

RUN yarn install --immutable

# ---------- builder ----------
FROM node:20-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare yarn@4.9.2 --activate

COPY --from=deps /app /app
COPY apps/frontend/ apps/frontend/
COPY packages/ packages/

WORKDIR /app/apps/frontend
RUN yarn build

# ---------- runner ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

COPY --from=builder /app/apps/frontend/.next ./.next
COPY --from=builder /app/apps/frontend/public ./public
COPY --from=builder /app/apps/frontend/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

USER nextjs
EXPOSE 3000
CMD ["yarn", "start", "-p", "3000"]
