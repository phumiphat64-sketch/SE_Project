# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG MONGODB_URI
ARG JWT_SECRET

ENV MONGODB_URI=$MONGODB_URI
ENV JWT_SECRET=$JWT_SECRET

RUN npm run build


# ---------- Stage 2: Production ----------
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

# copy only package files
COPY --from=builder /app/package*.json ./

# install production dependencies only
RUN npm install --omit=dev

# copy built app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./

EXPOSE 3000

CMD ["npm", "start"]