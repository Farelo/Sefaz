FROM node:9-alpine

USER root

WORKDIR /app

COPY . /app

RUN apk update && apk add python2 alpine-sdk && \
    npm install pm2 node-gyp node-pre-gyp -g && \
    npm install

EXPOSE 3000

ENTRYPOINT [ "npm", "run", "prod" ]