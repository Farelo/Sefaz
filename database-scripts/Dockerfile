FROM node:10.14-alpine

USER root

RUN apk update && apk upgrade \
    && apk add python2 alpine-sdk \
    && npm i pm2 node-gyp node-pre-gyp -g

WORKDIR /app

# Esse copy é para permitir que o docker faça cache da imagem depois do segundo build, para nao ter que instalar todas as dependências sempre que rodar o build
COPY package*.json ./

# instala as dependências - preciso usar os options a seguir para rodar o generate_env.tools 
RUN npm install

#copia o resto do projeto depois que as dependencias foram instaladas e depois que o config de produção foi gerado
COPY . .

EXPOSE 28050

# executar o script desejado (manter sempre comentado, depois de rodar o script desejado, para outros nao rodarem sem querer o script errado)
# ENTRYPOINT [ "npm", "run", "update-last-battery-to-rack" ]
#  ENTRYPOINT [ "npm", "run", "update-battery-zero" ]