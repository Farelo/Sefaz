FROM node:10.12-alpine

USER root

WORKDIR /app

COPY packe*.json .

RUN apk update && apk add python2 alpine-sdk && \
    npm install pm2 node-gyp node-pre-gyp -g && \
    npm install

RUN npm i bcrypt --unsafe-perm=true --allow-root

COPY . .

EXPOSE 8011

ENTRYPOINT [ "npm", "run", "prod" ]
