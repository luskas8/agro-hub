# Agro-hub

O Agro-hub é uma API robusta desenvolvida em NestJS, utilizando PostgreSQL como banco de dados e Prisma ORM para gerenciamento de dados. Esta aplicação foi projetada para otimizar a gestão de produtores rurais e suas propriedades agrícolas, oferecendo funcionalidades essenciais para cadastro, validação de informações e um dashboard analítico.

# Menu Agro-hub

*   [Acesso à API](#acesso-à-api)
*   [Contato para Acesso à API](#contato-para-acesso-à-api)
*   [Como Buildar e Configurar o Projeto](#como-buildar-e-configurar-o-projeto)
*   [Como Executar Localmente](#como-executar-localmente)
*   [Requisitos de Negócio (User Cases)](#requisitos-de-negócio-user-cases)
*   [Documentação da API (Swagger)](#documentação-da-api-swagger)
*   [Autenticação da API: Basic Auth](#autenticação-da-api-basic-auth)
*   [Próximos Passos: Usuários e Autenticação JWT](#próximos-passos-usuários-e-autenticação-jwt)

## Acesso à API

A API do Agro-hub está disponível publicamente em:

`https://api.luskas8.pro`

### Contato para Acesso à API
Para solicitar acesso à API do Agro-hub ou para qualquer dúvida e suporte, por favor, entre em contato através do e-mail:

**LinkedIn:** https://www.linkedin.com/in/luskas8/

**E-mail:** luskanjos@gmail.com

**Assunto do E-mail:** [Agro-hub] Solicitação de Acesso à API

Ao enviar o e-mail, por favor, inclua uma breve descrição do seu interesse ou do projeto para o qual você precisa de acesso.

## Como Buildar e Configurar o Projeto

Para configurar e buildar o projeto localmente, siga os passos abaixo:

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/luskas8/agro-hub.git
    cd agro-hub
    ```

2.  **Crie o arquivo `.env` local:**
    Execute o script `dev-utils.sh` para gerar o arquivo de variáveis de ambiente necessário para a execução local.
    ```bash
    ./scripts/dev-utils.sh setup
    ```

## Como Executar Localmente

Após configurar o arquivo `.env`, você pode iniciar a aplicação e o banco de dados localmente usando Docker Compose:

1.  **Inicie os serviços:**
    ```bash
    ./scripts/dev-utils.sh run
    ```
    Este comando irá construir as imagens Docker (se necessário), iniciar os contêineres do PostgreSQL e da aplicação NestJS.

2.  **Acesse a aplicação:**
    A API estará disponível em `http://localhost:3003` (ou na porta configurada no seu `.env`).

3.  **Para parar e remover os contêineres:**
    ```bash
    ./scripts/dev-utils.sh down
    ```

## Requisitos de Negócio (User Cases)

O Agro-hub atende aos seguintes requisitos de negócio, apresentados como user cases:

*   **Gerenciamento de Produtores Rurais:**
    *   Como um usuário, desejo cadastrar novos produtores rurais, fornecendo suas informações básicas.
    *   Como um usuário, desejo editar as informações de produtores rurais existentes.
    *   Como um usuário, desejo excluir produtores rurais do sistema.

*   **Validação de Documentos:**
    *   Como um usuário, desejo que o sistema valide automaticamente o formato do CPF ou CNPJ fornecido durante o cadastro do produtor rural.

*   **Validação de Áreas da Fazenda:**
    *   Como um usuário, desejo que o sistema garanta que a soma da área agricultável e da área de vegetação de uma fazenda não exceda a área total da fazenda.

*   **Registro de Culturas por Fazenda:**
    *   Como um usuário, desejo registrar múltiplas culturas plantadas para cada fazenda de um produtor.

*   **Associação Produtor-Propriedade:**
    *   Como um produtor rural, posso estar associado a zero, uma ou várias propriedades rurais.

*   **Registro de Culturas por Safra:**
    *   Como uma propriedade rural, posso ter zero, uma ou várias culturas plantadas por safra.

*   **Dashboard Analítico:**
    *   Como um usuário, desejo visualizar um dashboard que exiba o total de fazendas cadastradas.
    *   Como um usuário, desejo visualizar um dashboard que exiba o total de hectares registrados (área total de todas as fazendas).
    *   Como um usuário, desejo visualizar gráficos de pizza que mostrem a distribuição de fazendas por estado.
    *   Como um usuário, desejo visualizar gráficos de pizza que mostrem a distribuição de culturas plantadas.
    *   Como um usuário, desejo visualizar gráficos de pizza que mostrem a distribuição do uso do solo (área agricultável vs. área de vegetação).

## Documentação da API (Swagger)

A documentação completa da API está disponível através do Swagger UI. Após iniciar a aplicação localmente, você pode acessá-la em:

`http://localhost:3003/docs`

Esta documentação interativa permite explorar todos os endpoints disponíveis, seus parâmetros de requisição e exemplos de resposta.

## Autenticação da API: Basic Auth

Todas as rotas desta API são protegidas por autenticação Basic Auth. Isso significa que para acessar qualquer endpoint, você precisará fornecer um nome de usuário e uma senha válidos na requisição HTTP.

### Como Autenticar

Para realizar requisições autenticadas, inclua o cabeçalho `Authorization` com o tipo `Basic` seguido de uma string codificada em Base64 no formato `username:password`.

## Próximos Passos: Usuários e Autenticação JWT

Para garantir a segurança e o controle de acesso à API, os próximos passos incluem a implementação de um sistema de usuários e autenticação baseado em JSON Web Tokens (JWT).

*   **Módulo de Usuários:**
    *   Criar um novo módulo para gerenciar usuários, incluindo cadastro (com hash de senhas), login e gerenciamento de perfis.
    *   Definir um esquema de banco de dados para armazenar informações de usuário (e-mail, senha, etc.).

*   **Autenticação JWT:**
    *   Implementar estratégias de autenticação JWT para proteger as rotas da API.
    *   Gerar tokens JWT no login do usuário e validá-los em requisições subsequentes.
    *   Utilizar `Guards` e `Decorators` do NestJS para proteger endpoints específicos, garantindo que apenas usuários autenticados e autorizados possam acessá-los.
    *   Considerar a implementação de refresh tokens para melhorar a experiência do usuário e a segurança.

*   **Autorização:**
    *   Adicionar um sistema de roles (papéis) ou permissões para controlar o acesso a funcionalidades específicas com base no tipo de usuário (ex: administrador, produtor).