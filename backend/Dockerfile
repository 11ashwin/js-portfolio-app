# syntax=docker/dockerfile:1

# ---- deps stage: install only production dependencies, cached separately
# from source so code changes don't invalidate the npm install layer ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ---- final stage: minimal runtime image ----
FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY src ./src

# node:20-alpine already ships an unprivileged "node" user (uid 1000) —
# reuse it instead of running as root, satisfying Kyverno's non-root policy.
USER node

EXPOSE 3001

# Lets `kubectl get pods` / readiness probes and Docker itself detect a
# hung or crashed process without waiting on the K8s probe interval alone.
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3001/api/health || exit 1

CMD ["node", "src/server.js"]
