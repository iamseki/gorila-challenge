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

## Rodando a API localmente

### Com docker-compose :whale2:

- **`npm run up`**

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
## Rodando testes unitários 

- **`npm run test`**

- com cover: **`npm run test:ci`**

---

## Considerações

- Documentação do entendimento do problema proposto, no *notion* [link acessível](https://www.notion.so/chriseki/Gorila-Back-End-Challenge-4ceb0bb4fe6a4d65b3d3cb0e2f693a0c)

- Desenvolvimento do script que processa o arquivo csv e persiste no mongo [link repositório](https://github.com/iamseki/csv-to-db)

- ***TODO*** Desenvolvimento do frontend que consome esta API