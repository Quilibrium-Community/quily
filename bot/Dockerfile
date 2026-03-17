FROM node:22-slim AS builder
WORKDIR /app/bot
COPY bot/package.json bot/package-lock.json* ./
RUN npm ci
COPY bot/tsup.config.ts bot/tsconfig.json ./
COPY bot/src/ ./src/
# Shared RAG code needed at build time
COPY src/lib/ /app/src/lib/
RUN npm run build

FROM node:22-slim
WORKDIR /app
COPY bot/package.json bot/package-lock.json* ./
RUN npm ci --production
COPY --from=builder /app/bot/dist ./dist
CMD ["node", "dist/index.js"]
