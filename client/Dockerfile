# Common build stage
FROM node:19.2.0-alpine3.15

COPY package.json /app/package.json

WORKDIR /app

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3000

CMD ["yarn", "run", "start"]