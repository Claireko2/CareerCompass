######################## 1. build stage ########################
FROM node:20-alpine AS builder

WORKDIR /app
RUN corepack enable                        # Yarn 4 via Corepack

# ── 1️⃣  copy root manifests so Yarn sees every workspace
COPY package.json yarn.lock .yarnrc.yml .yarn/ ./

# (debug) list workspaces Yarn sees
RUN yarn workspaces list

# ── 2️⃣  copy backend manifest only
COPY apps/backend/package.json apps/backend/

# ── 3️⃣  *Install WITH devDependencies* — rimraf & tsc will be present
RUN yarn workspaces focus @career-compass/backend

# ── 4️⃣  copy backend source
COPY apps/backend/ apps/backend/

# ── 5️⃣  build (runs “yarn clean && tsc -b” → needs rimraf)
WORKDIR /app/apps/backend
RUN yarn build

# ── 6️⃣  OPTIONAL: prune devDependencies so runtime layer is small
RUN yarn workspaces focus --production @career-compass/backend --all


######################## 2. runtime stage ########################
FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

# copy only runtime deps & compiled code from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/apps/backend/prisma ./prisma

EXPOSE 8000
CMD ["node", "dist/main.js"]