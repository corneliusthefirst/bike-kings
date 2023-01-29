FROM node:15.8.0-alpine3.10

WORKDIR /app
COPY . .

RUN yarn add express

RUN yarn install
CMD yarn docker:dev
