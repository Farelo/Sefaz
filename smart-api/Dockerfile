FROM node:6.9.5

ENV HOME=/home

COPY package.json package-lock.json  $HOME/smart-api/

WORKDIR $HOME/smart-api

RUN npm cache clean && npm install --silent --progress=false

COPY . $HOME/smart-api/

CMD ["npm", "start"]
