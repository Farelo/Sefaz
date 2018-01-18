FROM node:6.9.5

ENV HOME=/home

COPY package.json package-lock.json  $HOME/smart-front/

WORKDIR $HOME/smart-front

RUN npm cache clean && npm install --silent --progress=false

COPY . $HOME/smart-front/

RUN ./node_modules/.bin/ng build

CMD ["npm", "start"]
