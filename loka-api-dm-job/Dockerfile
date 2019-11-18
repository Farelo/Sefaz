FROM node:10.14-alpine

USER root

RUN apk update && apk upgrade \
    && apk add python2 alpine-sdk \
    && npm config set unsafe-perm true \
    && npm i pm2 node-gyp node-pre-gyp -g

WORKDIR /app

# Esse copy é para permitir que o docker faça cache da imagem depois do segundo build, para nao ter que instalar todas as dependências sempre que rodar o build
COPY package*.json ./

# Esses copies devem estar aqui porque o npm roda um script postinstall para gerar arquivo config de producção que usam esses diretorios ou arquivos abaixo
#rodando o generate-env aqui, entao nao precisa desses copies abaixo mais
# COPY ./src/tools/ ./src/tools/
# COPY ./src/config/ ./src/config/
# COPY .env-tmp .env-tmp

# instala as dependências - preciso usar os options a seguir para rodar o generate_env.tools 
RUN npm install

#copia o resto do projeto depois que as dependencias foram instaladas e depois que o config de produção foi gerado
COPY . .

EXPOSE 8013

# RUN npm run generate-env --unsafe-perm=true --allow-root

# executar prod quando for pra produção
ENTRYPOINT [ "npm", "run", "prod" ]

# executar start quando testar localmente (dev)
# ENTRYPOINT [ "npm", "run", "start" ]