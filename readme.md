# Title

## Passo a passo:
* passo: importar os database para o mongo db utilizando o seguinte codigo no terminal 
 "mongorestore -d reciclopac <directory_backup>"
* passo: rodar no terminal o comnado "mongod" para start o banco de dados 
* passo: rodar o comando "npm install" no terminal dentro da pasta "smart-api" para obter as dependencias 
* passo: rodar o servidor no terminal dentro da pasta "smart-api" utilizando o comando "nodemon app.js"
* passo: rodar o front utilizando o comando "ng serve"


avaliar o ip do container criado para o mongo
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' mongo
[link](Google)