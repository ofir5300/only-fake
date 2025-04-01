FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./
COPY client/package.json ./client/
COPY server/package.json ./server/
COPY shared/package.json ./shared/

RUN yarn install --frozen-lockfile
RUN yarn add -W concurrently

COPY . .

# Build shared package
RUN yarn workspace @only-fake/shared build

EXPOSE 3001 3002

CMD ["yarn", "start:all"] 