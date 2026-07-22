# Build stage - use Node.js for compatibility with Railway
FROM node:22-alpine AS builder
WORKDIR /usr/src/app

# Install dependencies
COPY package.json bun.lock* pnpm-lock.yaml* ./
RUN npm install -g bun && bun install --frozen-lockfile

# Copy source code
COPY . .

# Build Next.js application
RUN bun run build

# Production stage - lightweight runtime image
FROM node:22-alpine
WORKDIR /usr/src/app

# Install bun for production
RUN npm install -g bun

# Copy only necessary files from builder
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/bun.lock* ./

# Install production dependencies only
RUN bun install --frozen-lockfile --production

EXPOSE 3000
ENV NODE_ENV=production

CMD ["bun", "run", "start"]
