FROM node:20

RUN apt-get update && apt-get install -y iproute2

WORKDIR /app
COPY package.json pnpm-lock.yaml .
RUN npm install --omit=dev
COPY .env .
COPY src ./src
