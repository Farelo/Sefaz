FROM node:6.9.5 as builder

ARG baseurl

ARG port

ENV BASE_URL $baseurl

ENV PORT $port

ENV HOME=/home

COPY package.json package-lock.json  $HOME/smart-front/

WORKDIR $HOME/smart-front

COPY . $HOME/smart-front/

RUN node write_environment.js

RUN npm cache clean && npm install --silent --progress=false

RUN ./node_modules/.bin/ng build --env=prod

FROM nginx:1.13.3-alpine

## Copy our default nginx config
COPY --from=builder /home/smart-front/nginx/default.conf /etc/nginx/conf.d/

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/* &&  ls

## From 'builder' stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder /home/smart-front/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
