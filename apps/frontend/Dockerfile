# ---------- deps ----------
FROM node:20-alpine AS deps

RUN corepack enable

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml .yarn/ ./

RUN yarn install --immutable

FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

USER nextjs

EXPOSE 3000

CMD ["yarn", "start", "-p", "3000"]
