FROM node:10-alpine as builder

ENV BASE_URL $baseurl

ENV PORT $port

ENV HOME=/home

WORKDIR $HOME

COPY . .

RUN node write_environment.js && \
    npm install && \
    ./node_modules/.bin/ng build --env=prod

FROM nginx:1.13.3-alpine as main

## Copy our default nginx config
COPY --from=builder /home/nginx/default.conf /etc/nginx/conf.d/

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/* &&  ls

## From 'builder' stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder /home/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]