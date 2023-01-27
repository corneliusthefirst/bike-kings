# Common build stage
FROM node:19.2.0-alpine3.15

COPY package.json /app/package.json

WORKDIR /app

RUN yarn install
RUN apk add --no-cache bash

COPY . .

EXPOSE 3000

CMD ["yarn", "run", "start"]