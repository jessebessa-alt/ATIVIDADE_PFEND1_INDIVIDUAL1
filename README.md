# Gerenciador Operacional de Produtos — Next.js + Express (Em Sessão, Sem CORS e Sem Banco de Dados)

Projeto integrando os dois arquivos base (`ATIVIDADE_PFEND1_INDIVIDUAL` + `api-produtos-3td-2026s2`) em uma aplicação completa de **CRUD de Produtos** utilizando **Node.js**, **Express**, **Next.js (App Router)** e **Bootstrap 5**.

## Principais Características da Arquitetura

1. **Sem Banco de Dados (Tudo Salvo em Sessão):**
   - Foi removida a dependência do MySQL (`mysql2`).
   - Os produtos são armazenados diretamente na **sessão do usuário** no Express (`req.session.produtos`), utilizando `express-session` (com fallback nativo em memória via cookie HTTP `produtos.sid`).
   - Ao abrir o sistema, cada sessão recebe automaticamente os produtos iniciais de demonstração e mantém todas as alterações (cadastros, edições e exclusões) durante a sessão.

2. **Sem Uso de CORS (`cors`):**
   - O projeto **não utiliza** o pacote `cors` nem cabeçalhos Cross-Origin.
   - O arquivo `frontend/next.config.mjs` utiliza o recurso nativo **`rewrites`** do Next.js para atuar como proxy reverso de `/api/:path*` para `http://localhost:3001/api/:path*`.
   - Assim, o navegador se comunica exclusivamente com a mesma origem (`http://localhost:3000/api/produtos`), garantindo o envio automático do cookie de sessão (`credentials: "same-origin"`) sem bloqueios de CORS.

3. **CRUD Completo de Produtos:**
   - `GET /api/produtos` — Lista todos os produtos da sessão atual (calculando o valor total em estoque).
   - `GET /api/produtos/:id` — Busca os detalhes de um produto específico pelo ID.
   - `POST /api/produtos` — Valida os dados com a classe `Produto` e cadastra um novo produto na sessão.
   - `PUT /api/produtos/:id` — Valida e atualiza os dados (`nome`, `preco`, `estoque`, `categoria`) de um produto existente na sessão.
   - `DELETE /api/produtos/:id` — Remove um produto da sessão pelo ID.
   - `POST /api/produtos/resetar` — Restaura a lista inicial de produtos na sessão atual.

## Estrutura do Projeto

```text
ATIVIDADE_PFEND1_INDIVIDUAL/
├── backend/                        # API em Node.js + Express (Arquitetura em Camadas)
│   ├── config/
│   │   ├── ambiente.js             # Leitura do .env e diagnóstico do servidor
│   │   └── sessao.js               # Configuração do express-session / sessão em memória
│   ├── controllers/
│   │   └── ProdutoController.js    # Controlador HTTP (listar, buscar, criar, atualizar, remover, resetar)
│   ├── models/
│   │   ├── Produto.js              # Classe de domínio Produto com validações e cálculos
│   │   └── ProdutoModels.js        # Persistência em sessão (req.session.produtos)
│   ├── routes/
│   │   └── produtoRoutes.js        # Rotas REST em /api/produtos
│   ├── services/
│   │   └── ProdutoService.js       # Regras de negócio e validação das operações CRUD
│   ├── scripts/
│   │   └── check.js                # Script de verificação de sintaxe JS
│   ├── utils/
│   │   └── formatarMoeda.js        # Formatação monetária em Real (BRL)
│   ├── .env                        # Variáveis de ambiente configuradas (PORT=3001)
│   ├── app.js                      # Configuração do Express e middlewares de sessão
│   ├── package.json                # Dependências do back-end (express, express-session)
│   └── server.js                   # Inicialização do servidor Express na porta 3001
│
└── frontend/                       # Aplicação Web em Next.js (App Router) + Bootstrap 5
    ├── src/
    │   ├── app/
    │   │   ├── globals.css         # Estilos globais complementares ao Bootstrap
    │   │   ├── layout.jsx          # Layout raiz importando Bootstrap 5 CSS
    │   │   └── page.js             # Página principal integrando o CRUD com a API
    │   └── components/
    │       ├── Navbar.jsx          # Barra superior com ação de restaurar sessão
    │       ├── ResumoCards.jsx     # Cards de indicadores (total de itens, valor em estoque, categorias)
    │       ├── ProdutoForm.jsx     # Formulário reutilizável de Cadastro e Edição com validação
    │       ├── ProdutoTabela.jsx   # Tabela responsiva com busca, filtro por categoria e ações
    │       └── ModalDetalhes.jsx   # Modal de visualização por ID e simulador de desconto
    ├── next.config.mjs             # Proxy rewrites (/api/* -> http://localhost:3001/api/*) sem CORS
    └── package.json                # Dependências do front-end (next, react, bootstrap)
```

## Como Executar o Projeto

### 1. Iniciar o Back-end (Express na porta 3001)

Abra um terminal na pasta `backend`:

```bash
cd backend
npm install
npm start
```

O servidor da API estará rodando em `http://localhost:3001`.

### 2. Iniciar o Front-end (Next.js na porta 3000)

Abra outro terminal na pasta `frontend`:

```bash
cd frontend
npm install
npm run dev
```

Acesse no navegador: **`http://localhost:3000`**