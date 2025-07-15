######################## 1. build stage ########################
FROM node:20-alpine AS builder

# 1️⃣ Prepare workspace root
WORKDIR /app
RUN corepack enable                    
COPY package.json yarn.lock .yarnrc.yml .yarn/ ./   

# 2️⃣ ***add this line*** – just the backend manifest so Yarn “sees” it
COPY apps/backend/package.json apps/backend/

# 2️⃣ Install only the backend workspace (with dev deps)
RUN yarn workspaces focus @career-compass/backend

# 3️⃣ Copy backend source
COPY apps/backend/ apps/backend/

# 4️⃣ Generate Prisma client (now in the right folder)
WORKDIR /app/apps/backend
RUN yarn prisma generate   

# 5️⃣ Build TypeScript (assumes "yarn build" runs tsc -b)
RUN yarn build

# 6️⃣ Prune to prod deps only
RUN yarn workspaces focus --production @career-compass/backend --all


######################## 2. runtime stage ########################
FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

# copy runtime deps & compiled code
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/apps/backend/prisma ./prisma   

EXPOSE 8000
CMD ["node", "dist/main.js"]


