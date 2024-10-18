# Using a multi-stage build process

# Base image for the stages
FROM node:20-alpine AS base

# Install OS dependencies
RUN apk add --no-cache libc6-compat

# Set working directory for the application
WORKDIR /app

# Stage to install dependencies
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# Builder stage to build the Next.js application
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Disable Next.js telemetry if not needed during build
ENV NEXT_TELEMETRY_DISABLED 1
RUN AUTH_SECRET=dummy npm run build

# Production stage, set up the environment for running the application
FROM base AS runner
WORKDIR /app

# Set NODE_ENV to production to specify the environment
ENV NODE_ENV production
# Disable Next.js telemetry if not needed at runtime
ENV NEXT_TELEMETRY_DISABLED 1

# Setup user and group
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built files from the builder stage
COPY --from=builder /app/public ./public
RUN mkdir .next
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Change owner of .next directory for prerender cache
RUN chown nextjs:nodejs .next

# Use non-root user to run the application
USER nextjs

# Expose port 3000 for the service
EXPOSE 3000

# Set environment variables
ENV PORT 3000
ENV HOSTNAME="0.0.0.0"

# Run the Next.js server on start-up
CMD ["node", "server.js"]