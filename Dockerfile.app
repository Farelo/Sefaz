FROM node:6.9.5

ENV HOME=/home

COPY ./smart-front/package.json ./smart-front/package-lock.json  $HOME/smart-front/

WORKDIR $HOME/smart-front

RUN npm cache clean && npm install --silent --progress=false

WORKDIR $HOME/smart-front/node_modules/.bin

RUN ls

WORKDIR $HOME

COPY ./smart-api/package.json ./smart-api/package-lock.json $HOME/smart-api/

WORKDIR $HOME/smart-api

RUN npm cache clean && npm install --silent --progress=false

WORKDIR $HOME

RUN ls

COPY ./smart-front $HOME/smart-front/

COPY ./smart-api $HOME/smart-api/

RUN ls

WORKDIR $HOME/smart-front

RUN ls && ./node_modules/.bin/ng build -env=prod

WORKDIR $HOME/smart-api

CMD ["npm", "start"]
