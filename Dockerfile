# 1) Dependencias
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# 2) Build
FROM node:20-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3) Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
# usuario no-root
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
# carpeta de uploads con permisos correctos
RUN mkdir -p /app/uploads && chown -R 1001:1001 /app/uploads
# artefactos standalone
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
# CMD robusto para Next standalone
CMD ["node", ".next/standalone/server.js"]
