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
Para rodar o sistema em **localhost**, basta iniciar um **mongodb** e em seguida dar **ng start** no path de cada serviço.

### Deploy em produção
Atualmente temos uma instância EC2 dedicada a cada cliente e outra instância dedicada às **pocs**.

O deploy para os clientes é feito a partir de um push na branch **master-<cliente>**. O deploy é iniciado automaticamente a partir do Jenkins. É possível acompanhar o progresso em http://<cliente>.relogtechnology.com:8080.

O deploy para as Pocs é feito a partir de um push na branch **master-pocs**. É possível acompanhar o progresso em http://poc.relogtechnology.com:8080.

O Jenkins "ouve" push nas branchs citadas e executa o **Docker-compose** disponível nas mesmas.
