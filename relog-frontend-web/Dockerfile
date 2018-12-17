FROM node:10-alpine

RUN apk update && apk upgrade

ARG baseurl

ARG port

ENV BASE_URL $baseurl

ENV PORT $port

ENV HOME=/home

COPY package*.json $HOME/relog-frontend-web/

WORKDIR $HOME/relog-frontend-web

COPY . $HOME/relog-frontend-web/

RUN node write_environment.js

RUN npm install --silent --progress=false

# RUN npm cache clean && npm install --silent --progress=false

RUN npm install --silent --progress=false

RUN ./node_modules/.bin/ng build --env=prod && ./node_modules/.bin/ng serve

# RUN ./node_modules/.bin/ng build --env=prod

# FROM nginx:1.13.3-alpine

# ## Copy our default nginx config
# COPY --from=builder /home/relog-frontend-web/nginx/default.conf /etc/nginx/conf.d/

# ## Remove default nginx website
# RUN rm -rf /usr/share/nginx/html/* &&  ls

# ## From 'builder' stage copy over the artifacts in dist folder to default nginx public folder
# COPY --from=builder /home/relog-frontend-web/dist /usr/share/nginx/html

# CMD ["nginx", "-g", "daemon off;"]
