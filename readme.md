# Reciclapac (Embalagens Inteligentes)

 A RECICLAPAC é uma empresa especializada no desenvolvimento de tecnologias de embalagens para logística reversa otimizada, Embalagens Inteligentes através da gestão com uma plataforma inovadora de software com tecnologia de IoT e implementação de processos de Upcycling de embalagens logísticas (reúso).

___

# Tecnologias Utilizadas
NodeJS

Docker

MongoDB

Jenkins

___

# Serviços
O projeto tem 5 serviços, são eles:

**Front**: Responsável por prover as telas para o usuário final.

**Back**: Responsável pelas regras de negócio do sistema.

**Websocket**: Responsável por consumir as mensagens dos dispositívos via o websocket da Loka.

**State-machine**: Responsável por atualizar o status dos dispositívos.

**MongoDB**: Armazena as informações do sistema.
___

# Deploy
### Rodar em localhost
Para rodar o sistema em **localhost**, basta iniciar um **mongodb** e em seguida dar **ng start** no path de cada serviço.

### Deploy na núvem
Atualmente temos um ambiente (T2.MEDIUM) dedicado à **Cebrace** e outro (T2.XLARGE) às **Pocs** (demais clientes, com menor porte).

O deploy para a Cebrace é feito a partir de um push na branch **master-cebrace**, a partir do Jenkins em http://relogtechnology.com:8080.

O deploy para as Pocs é feito a partir de um push na branch **master-pocs**, a partir do Jenkins em http://poc.relogtechnology.com:8080.

O Jenking "ouve" push nas branchs citadas e executa o **Docker-compose** disponível na mesma.