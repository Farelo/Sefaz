FROM node:10.14-alpine

USER root

RUN apk update && apk upgrade \
    && apk add python2 alpine-sdk \
    && npm config set unsafe-perm true \
    && npm i pm2 node-gyp node-pre-gyp -g

WORKDIR /app

# Esse copy é para permitir que o docker faça cache da imagem depois do segundo build, para nao ter que instalar todas as dependências sempre que rodar o build
COPY package*.json ./

# instala as dependências - preciso usar os options a seguir para rodar o generate_env.tools 
RUN npm install

#copia o resto do projeto depois que as dependencias foram instaladas e depois que o config de produção foi gerado
COPY . .

EXPOSE 8012

ENTRYPOINT [ "npm", "run", "prod" ]