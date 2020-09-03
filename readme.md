# Tecnologias utilizadas
Angular, Node.js, MongoDB, Docker, Jenkins, Swagger
___

# Módulos
O projeto tem 5 módulos, são eles:

**relog-frontend-web**: Responsável por prover as telas para o usuário final;

**relog-backend-api**: Responsável pelas regras de negócio do sistema;

**loka-api-dm-job**: Job responsável por coletar dados dos dispositivos na Loka;

**loka-websocket-job**: Responsável por consumir as mensagens dos dispositivos via o websocket da Loka;

**relog-state-machine-job**: Responsável por atualizar o status dos dispositívos;
___

# Deploy
### Rodar em localhost
Para rodar o sistema em **localhost**, basta iniciar um **mongodb** e em seguida dar **npm start** no path de cada serviço.

### Deploy em produção
Atualmente temos uma instância EC2 dedicada a cada cliente e outra instância dedicada às **pocs**.

A branch de desenvolvimento dos clientes em produção é a **develop**. O deploy para os clientes é feito a partir de um push na branch **master-[cliente]**. O deploy é iniciado automaticamente a partir do Jenkins. É possível acompanhar o progresso em http://[cliente].relogtechnology.com:8080.

Ou seja: as modificações são feitas em uma feature derivada da develop. Uma vez concluída, faz-se o merge da feature na develop. Merge da develop na master-[cliente].

### Deploy em ambiente poc

A branch de desenvolvimento do ambiente poc é a **develop-pocs**. O deploy para as Pocs é feito a partir de um push na branch **master-pocs**. É possível acompanhar o progresso em http://poc.relogtechnology.com:8080.

Ou seja: as modificações são feitas em uma feature derivada da develop. Uma vez concluída, faz-se o merge da feature na develop. Merge da develop na develop-pocs. Merge da develop-pocs na master-pocs.

### Deploy em ambiente QA

A branch de desenvolvimento do ambiente QA é a **develop-qa**. O deploy para o ambiene QA é feito a partir de um push na branch **master-qa**. É possível acompanhar o progresso em http://poc.relogtechnology.com:8080.

Ou seja: as modificações são feitas em uma feature derivada da develop. Uma vez concluída, faz-se o merge da feature na develop. Merge da develop na develop-qa. Merge da develop-qa na master-qa.

O Jenkins "ouve" push nas branchs master citadas e executa o **Docker-compose** disponível nas mesmas. Em cada deploy **verifique** se o docker-compose está correto após o merge.
