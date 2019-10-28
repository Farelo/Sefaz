FROM node:10.12-alpine

USER root

WORKDIR /app

COPY . .

RUN apk update && apk add python2 alpine-sdk && \
    npm config set unsafe-perm true && \
    npm install pm2 node-gyp node-pre-gyp -g && \
    npm install && \
    npm i bcrypt --unsafe-perm=true --allow-root

EXPOSE 8011

ENTRYPOINT [ "npm", "run", "prod" ]