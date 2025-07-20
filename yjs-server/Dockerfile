FROM node:20

WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml .
RUN pnpm install --prod
COPY .env tsup.config.json .
COPY src ./src
RUN pnpm build
