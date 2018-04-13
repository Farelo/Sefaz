# Reciclapac (Embalagens Inteligentes)

 A RECICLAPAC é uma empresa especializada no desenvolvimento de tecnologias de embalagens para logística reversa otimizada, Embalagens Inteligentes através da gestão com uma plataforma inovadora de software com tecnologia de IoT e implementação de processos de Upcycling de embalagens logísticas (reúso).

___

# Tecnologias Utilizadas

___

# Executando a instância do Cliente

Para executar a instância do cliente é necessário levantar o servidor (BACK-END), presente na pasta `smart-api`, pois o mesmo responsável por manipular e tratar os dados contidos na base de dados do MongoDB. O servidor apresenta uma RestFull API que irá forcener serviços em formato de rotas para que os sistemas possam consumir essas informações. Então para executar o servidor abra o terminar no diretório raiz e navega para o direotrio `smart-api`

```sh
$ cd smart-api
$ npm install
```
O comando `npm install` é utilizado para baixar todas as dependencias do projeto listadas na lista de dependências do `package.json`. Em seguida executa o comando:

```sh
$ npm run develop
```

Onde o mesmo irá executar o sistema em modo de desenvolvimento obtendo variveis que serão utilizadas apenas em modo de desenvolvimento. No console do terminal irá aparecer que o servidor esta executando em uma determinada porta, porém, pode ocorrer do sistema não conectar-se ao banco de dados do MongoDB. Na maioria das vezes isso se deve ao banco de dados do Mongo não esta executando, então é necessário abrir um terminal e executar o comando:
```sh
$ mongod
```
Esse comando executará o Banco de dado MongoDB e o sistema irá se conectar automaticamente ao banco de dados. O proximo passo será executar o sistema que irá consumir os serviços fornecidos pela RestFull API, então execute os seguintes comandos para acessar a pasta `smart-front`

```sh
$ cd ..
$ cd smart-front 
$ npm install
```

O comando `npm install` também é utilizado para baixar as dependencias do sistema (FRONT-END). Execute o comando :
```sh
$ ng server
```

Esse comando, fornecido pelo framework Angular CLI, é suficiente para executar o sistema.
___

# Executando a instância do Administrador Reciclapac

Essa instância serve apenas pra vizualizar os clientes que estão utilizando o reciclapac e ter acesso as instãncias desses clientes. Para executar essa instãncia pode-se utilizar os mesmos passos que foram citados na execução do cliente, pois, o que difere é apenas a nomenclatura das pastas, o que for `smart-api` trocar por `admin-api` e o que for `smart-front` trocar por `admin-front`.   

___

# Realizando Deploy do sistema

Para relaizar o Deploy do sistema é necessário editar o arquivo `docker-compose.prod.yaml`. Caso queira adicionar novas instâncias do sistema é necessário utiliza-lo:

```docker-compose

version: "2.0"
services:
  cliente-front:
    build:
      context: 'smart-front'   #local de acesso onde a imagem do docker será criada
      dockerfile: Dockerfile
      args: 
        baseurl: <URL>   #URL base de acesso a RestFull API 
        port: <PORTA>    #porta em que o sistema irá ser levantado
    container_name: cliente-front
    ports:
      - '<porta que será levantada a aplicação>:<porta real>'        #obrigratorio
  cliente-api: #finalizado 
    build:
      context: 'smart-api'
      dockerfile: Dockerfile
    command: npm start
    container_name: cliente-api
    environment:
      NODE_ENV: production       # variavel de ambiente que define que o sistema irá executar em produção
      HOST: <IP de acesso>               
      PORT: <PORTA>                    
      DATABASE: <nome da base de dados>         
      DATABASE_SERVICE: <nome do container do mongo>  
      # DNS: <DNS de acesso ao servidor> #necessário apenas se se o HOST e o IP não forem definidos              
    tty: true
    ports:
      - '<porta que será levantada a aplicação>:<porta real>'        #obrigratorio
    depends_on:
      - mongo
  mongo:
    image: 'mongo:latest'
    container_name: mongo
    ports:
      - '27017:27017'
    volumes:  #volume de compartilhamento da base de dados do container com o diretorio local
       - ./data/db:/data/db
       - ./data/backup:/data/backup
    networks: #definindo uma rede de IP fixo para o banco de dados utilizando o network do docker
      net-recicla:
        ipv4_address: 172.18.0.2
networks: #network criado para fixar o IP da base de dados do Mongo para acessa-lo remotamente
  net-recicla:
    driver: bridge
    ipam:
     config:
       - subnet: 172.18.0.0/16
         gateway: 172.18.0.1

```

Depois do arquivo ser configurado, executar o comando que irá gerar as imagens de cada uma das instãncias:


```sh
$ docker-compose -f docker-compose.prod.yaml build
```

Depois das imagens serem geradas, execute o comando que irá levantar os serviços que serão orquestrados pelo docker-compose:

```sh
$ docker-compose -f docker-compose.prod.yaml up -d
```
