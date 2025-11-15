# === Stage 1: Builder ===
# This stage installs dependencies, builds the source code, and generates the standalone output.
FROM node:20-alpine AS builder

# 1. --- ADD THIS LINE ---
# Declare the build argument so we can receive it from docker-compose
ARG NEXT_PUBLIC_API_BASE_URL

# 2. --- ADD THIS LINE ---
# Set it as an environment variable *for this stage*
# so the `pnpm build` command can access it.
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}

# Install pnpm (since you are using pnpm-lock.yaml)
RUN npm install -g pnpm

WORKDIR /app

# Copy dependency manifests
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# --- ADD THIS LINE TO FIX THE ERROR ---
RUN pnpm add geist
# --------------------------------------

# Copy all source code
COPY . .

# Build the Next.js application
# This will now correctly embed the URL into the static files
RUN pnpm build

# === Stage 2: Runner ===
# This stage creates the final, small production image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the standalone output from the builder stage
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# Copy the compiled static assets (CSS, JS, etc.)
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Copy the public assets
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Set the user
USER nextjs

EXPOSE 3000

ENV PORT=3000

# Run the Next.js server
CMD ["node", "server.js"]