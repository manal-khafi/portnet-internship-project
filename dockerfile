FROM node:22-alpine AS builder
WORKDIR /app

# 1. Install dependencies
COPY package*.json ./
RUN npm ci --include=dev

# 2. Copy the rest of the files (including prisma.config.ts)
COPY . .

# 3. Prisma 7 needs the URL at build time to validate the config
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# 4. Generate the client and build the app
RUN npx prisma generate
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["node", "server.js"]