# API-REST
Api rest desenvolvida em javascript para gerenciar operações de laboratorios e exames como objeto de teste técnico
 
 ## Principais Elementos utilizados no desenvolvimento
 - node v10.14.0
 - express v4.17.1
 - npm v8.5.5
 - eslint v8.12.0
 - jest v27.5.1
 - supertest v6.2.2
 - docker v20.10.12
 - docker-compose v1.26.0
 - mongoose v5.10.6
 - mongodb v4.2
 
## Descrição
 A API foi elaborada com dois objetivos principais:
  - Gerenciar registros de laboratórios e exames
  - Gerenciar operações de vinculação entre os exames e os laboratórios

Para realizar essas tarefas, a api foi elaborada obedecendo os padrões RESTful, manipulando e gerenciando dados por meio de requisições HTTP em format JSON.

 - Como banco de dados, foi utilizado o Mongo DB implemendo três collections:
  - **Exam**, contendo os registros:
    - name
    - type ["Clinical","Image"]
    - status["Active","Inactive"]
  - **Laboratory**, contendo os registros:
    - name
    - address
    - status["Active","Inactive"]
  - **Association**, contendo os registros:
    - idExam
    - idLaboratory

  **Obs**: os campos type em Exams e status em Exams e Laboratory são do tipo enum, reconhecendo apenas as strings que estão indicadas entre colchetes.

**IMPORTANTE** como a aplicação é objeto de um teste, não foram implementados esquemas de perfis de usuário nem autenticação.

Por meio da collection association um exame é vinculado a um laboratório.
Assim, toda vez que um exame é associado a um laboratório, é criado um registro na collection association contendo o _id do registro e os ids do laboratório e também do exame.


Além das operações de CRUD convencionais, também fora implementadas as seguintes funcionalidades extras:
 - Rotas para mudar o status de Active para Inactive tanto dos exames, quanto dos laboratórios
 - Rota para retornar os laboratórios e os exames que estiverem com status Active
 - Cadastro, Atualização e remoção em lotes nas collections Exam e Laboratory
 - Rota que recebe um nome de um exame e retorna todos os laboratórios associados a ele.

Além das funções de gerenciamento das collections por meio das rotas, também foram criados scripts de testes automatizados utilizando os bibliotecas Jest e Supertest, em que são implementados mais de 30 testes empregados nas rotas da aplicação.

Além dos testes automatizados, visando facilitar a escalabilidade e automatização de processos a api é executada utilizando docker-compose de forma que dois containers são criados na execução, um para o banco de dados e outro para a aplicação. Estes containers são conectados por uma network que deve ser construída via comando docker.

## Deploy
Para realizar o deploy foi criado uma instância EC2 no serviço de cloud da AWS. Esta instância está disponível para consumo por meio do endereço http://ec2-15-228-47-50.sa-east-1.compute.amazonaws.com/.

**IMPORTANTE**: Toda a documentação para utilização da API contendo a descrição das rotas e o modelo das  informações trafegadas foram elaboradas utilizando o Swagger e podem ser consutadas acessando http://ec2-15-228-47-50.sa-east-1.compute.amazonaws.com/api/doc/

Para realizar o redirecionamento das rotas para o container que executa a aplicação o arquivo de configuração do NGINX foi elaborado para que ele seja utilizado como proxy reverso.  Como esta api se trata de um teste, não foram inserido o certificado SSL para proteção das rotas.

Foi elaborado um pipeline CI/CD utilizando jenkins para a automatizar o deploy da aplicação, entretanto não consegui realizar o deploy e todas as configurações na instância EC2 da AWS pois quando a pipeline era iniciada a instância travava (acredito que por limitações de recurso por ser o que a AWS oferece gratuitamente), conseguindo apenas simular este pipeline em localhost.


##Execução 
- Para executar o projeto localmente deve-se seguir os seguintes passos:
 - Clonar o repositório
 - instalar o docker e docker-compose
 - executar o comando para criar a network que irá interligar o container da aplicação com o do mongoDb
   - **docker network create net-wa**
 - criar um arquivo .env na raiz do projeto, de forma análoga ao descrito do arquivo env-example do repositório
 - executar o comando **"docker-compose up"** dentro do diretório raiz do projeto
  