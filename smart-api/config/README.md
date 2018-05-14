# Configurações

O local de configurações é responsavel pro fornecer as variaveis de ambiente do sistema assim como realizar a conexão com o banco de dados do Mongo e tambem fornecer todos os esquemas definidos para o mongo para o sistema

### Environments

Esse arquivo contem as configurações tanto para o modo em desenvolvimento como para o modo em produção que será definido através da variavel de ambiente `NODE_ENV`. A variavel `process.env` contém todas as variaveis de ambiente declaradas para o sistema

### Swagger 

Um modulo utilizado para contruir o documento swagger que será utilizado para a documentação do sistema. Esse modulo reuni todos os modulos do swagger criados separadamente.



 ## MongoDB (Ferramentas)

* dump do database do MongoDB `mongodump -d <nome da base de dados> -o <directory backup>`
* importar o database para o MongoDB utilizando o seguinte codigo no terminal  `mongorestore -d <nome da base de dados> <directory backup>`
* rodar no terminal o comando `mongod` para start o banco de dados
* entrar no bash do mongo no servidor em produção `docker exec -it mongo bash`
* avaliar o ip do container criado para o mongo `docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' mongo`