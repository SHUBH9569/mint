# Multi-stage build for Next.js app
FROM node:22-slim AS deps
WORKDIR /app
# Install bun for package management
RUN npm install -g bun
COPY package.json bun.lock* ./
# Use bun to install since we have bun.lock
RUN if [ -f bun.lock ]; then bun install; else npm install; fi

FROM node:22-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm install -g bun && bun run build

FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
