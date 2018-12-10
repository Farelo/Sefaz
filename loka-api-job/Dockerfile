FROM node:10.14-alpine

USER root

RUN apk update && apk upgrade \
    npm install 
    # pm2 python2 node-gyp node-pre-gyp

WORKDIR /app

COPY package*.json ./

COPY . .

# RUN npm install
EXPOSE 9060

ENTRYPOINT [ "npm", "run", "start" ]