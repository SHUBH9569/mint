# Build stage
FROM node:22-slim AS builder
WORKDIR /app

# Copy dependency files
COPY package.json bun.lock* ./

# Install dependencies using npm (compatible with bun.lock)
RUN npm install

# Copy source
COPY . .

# Build Next.js
RUN npm run build

# Production stage
FROM node:22-slim
WORKDIR /app

# Install dumb-init for proper signal handling
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init && rm -rf /var/lib/apt/lists/*

# Copy built app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./

# Install production dependencies only
RUN npm install --production

EXPOSE 3000
ENV NODE_ENV=production

ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]
