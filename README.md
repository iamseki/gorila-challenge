<h2 align="center">
  <a href="https://vizir.com.br/">
    <img alt="Open Weather Logo" src="https://gorila.com.br/wp-content/uploads/LogoGorila.svg" width="250px" />
  </a>
</h2>
<h1 align="center">
  Backend Challenge
</h1>

<p align="center">Projeto realizado com o intuito de atender aos requisitos do processo seletivo de <strong>Desenvolvedor Backend</strong> da Gorila.</p>

<p align="center">
  <a href="https://github.com/iamseki">
    <img alt="Made by Christian Seki" src="https://img.shields.io/badge/made%20by-Christian%20Seki-brightgreen">
  </a>
</p>

## Deploy

### Frontend :earth_asia:

- https://iamseki.github.io/gorila-front/

### Backend :earth_americas:

- https://gorila-challenge-api.herokuapp.com/api/v1/hc


| Endpoint         | Método        | Descrição                                |
| -----------------| --------------| -----------------------------------------|
| `api/v1/calculate/cdb` | `POST`  | Recurso responsável pelo cálculo do CDB  |

- **Exemplo de chamada:**

  ```shell
    curl -X POST \
     -H "Content-type:application/json" \
     http://{API_URL}/api/v1/calculate/cdb \
     -d '{ "investmentDate":"2016-11-14", "cdbRate": 103.5, "currentDate":"2016-12-26" }'
  ```

- Para o MongoDB utilizei o DaaS [Mongo Atlas](https://docs.atlas.mongodb.com/cluster-tier) com recursos computacionais limitados `512 MB de storage` e `RAM compartilhada`

## Rodando a API localmente

### Com docker-compose :whale2:

- **`npm i` && `npm run up`**

>Para remover os containers e parar os serviços execute **npm run down** ou **npm run stop** para stop nos containers

### Sem docker-compose :hammer:

A API depende de uma instância do *mongodb* rodando, instruções para execução/download [aqui](https://www.mongodb.com/try/download/community)

Ou para rodar via docker: `docker run --name gorila-mongo -p 27017:27017 -d mongo`

Com o mongodb *up* popular o banco com o CSV fornecido:

**Linux**

  - `./scripts/populate-script`

**Windows**

  - `./scripts/populate-script.exe`

- Agora é só buildar com `npm run build` e startar a API **`npm run start`**
## Rodando testes

### Testes unitários :one:

- **`npm run test`**

- com cover: **`npm run test:ci`**

### Testes de performance com k6.js :muscle:

Caso não tenha, segue link para instalação do [binário do k6](https://k6.io/docs/getting-started/installation)

O teste simula um total de aprox. 150 requests por segundo em um período de 5 minutos resultando aprox 45000 requisições, é um símples teste de carga considerando o seguinte threshold:

- O tempo de resposta de 99% das requisições devem se manter abaixo de 1.5s independente da carga no servidor.

- Execute: `k6 run -e API_BASE='http://localhost:8080' scripts/k6-tests.js`

  - `API_BASE` indica Endpoint da aplicação, o exemplo anterior aponta para a API rodando localmente via docker-compose.

---

## Considerações

- Documentação do entendimento do problema proposto, no *notion* [link acessível](https://www.notion.so/chriseki/Gorila-Back-End-Challenge-4ceb0bb4fe6a4d65b3d3cb0e2f693a0c)

- Desenvolvimento do script que processa o arquivo csv e persiste no mongo [link repositório](https://github.com/iamseki/csv-to-db)

- Desenvolvimento do frontend que consome esta API [link repositório](https://github.com/iamseki/gorila-front)

