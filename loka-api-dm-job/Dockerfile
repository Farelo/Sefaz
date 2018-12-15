FROM node:10.14-alpine

USER root

RUN apk update && apk upgrade \
    npm install pm2 python2 node-gyp node-pre-gyp

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 9060

#ENTRYPOINT [ "npm", "run", "start" ]
ENTRYPOINT [ "npm", "run", "start-initial-load" ]