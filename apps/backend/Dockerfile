######################## 1. build stage ########################
FROM node:20-alpine AS builder

WORKDIR /app
RUN corepack enable                    
COPY package.json yarn.lock .yarnrc.yml .yarn/ ./   

COPY apps/backend/package.json apps/backend/

RUN yarn workspaces focus @career-compass/backend

COPY apps/backend/ apps/backend/

WORKDIR /app/apps/backend
RUN yarn prisma generate   

RUN yarn build

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



