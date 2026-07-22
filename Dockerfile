# Build stage
FROM node:22-alpine AS builder
WORKDIR /app

# Install Bun
RUN npm install -g bun@latest

# Copy package files
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Build Next.js
RUN bun run build

# Production stage
FROM node:22-alpine
WORKDIR /app

# Install Bun for runtime
RUN npm install -g bun@latest

# Copy built application from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/bun.lock ./

# Install production dependencies
RUN bun install --production

EXPOSE 3000
ENV NODE_ENV=production

CMD ["bun", "run", "start"]
