FROM node:8.0.0

ENV HOME=/home

COPY package.json package-lock.json  $HOME/smart-api/

WORKDIR $HOME/smart-api

RUN npm install --silent --progress=false

COPY . $HOME/smart-api/

CMD ["npm", "start"]
