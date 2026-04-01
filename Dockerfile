# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build


# ---------- Stage 2: Production ----------
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -S app && adduser -S app -G app

# copy only package files
COPY --from=builder /app/package*.json ./

# install production dependencies only
RUN npm ci --omit=dev --no-cache

# copy built app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD wget --quiet --tries=1 --spider http://localhost:3000

USER app

EXPOSE 3000

CMD ["npm", "start"]