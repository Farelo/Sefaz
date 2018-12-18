FROM node:10-alpine as builder

ENV BASE_URL=https://relogtechnology.com/api

ENV PORT $port

ENV HOME=/home

WORKDIR $HOME

COPY . .

RUN node write_environment.js && \
    npm install && \
    ./node_modules/.bin/ng build --env=prod --base-href /cebrace/

FROM nginx:1.13.3-alpine as main

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/* &&  ls

## From 'builder' stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder /home/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
