FROM node:latest

# App directory
WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .
