# Multi-stage build for Next.js app
FROM node:22-slim AS deps
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* bun.lock* ./
RUN npm install

FROM node:22-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
