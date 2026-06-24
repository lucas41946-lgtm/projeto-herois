# 🛡️ Portal de Heróis

Plataforma Fullstack para gerenciamento de heróis por recrutadores credenciados. Projeto final das disciplinas **Linguagem de Programação III** e **Desenvolvimento Web III** — FIEC 2026.

Cada recrutador possui acesso restrito ao sistema, podendo cadastrar, gerenciar e enviar seus próprios heróis para missões, com persistência em banco de dados relacional.

---

## 🔗 Links de Produção

> Preencher após o deploy.

- **Frontend (Vercel):** _em breve_
- **Backend (Render):** _em breve_
- **Repositório:** https://github.com/lucas41946-lgtm/projeto-herois

---

## ⚙️ Tecnologias

### Backend
- Node.js + Express
- MySQL (banco relacional)
- JWT (autenticação por token)
- BCrypt (hash de senhas)
- Zod (validação de dados)
- CORS

### Frontend
- React + Vite
- Tailwind CSS v4
- React Router (navegação e proteção de rotas)
- TanStack Query (sincronização de dados)
- Context API (estado global de autenticação)
- Axios

---

## 🗂️ Estrutura do Projeto

```
projeto-herois/
├── backend/
│   ├── src/
│   │   ├── config/        # conexão com o banco
│   │   ├── controllers/   # regras de negócio
│   │   ├── routes/        # definição das rotas
│   │   ├── middlewares/   # proteção JWT
│   │   ├── schemas/       # validações Zod
│   │   └── server.js      # ponto de entrada
│   └── database.sql       # script de criação do banco
└── frontend/
    └── src/
        ├── api/           # configuração do Axios
        ├── components/    # componentes reutilizáveis
        ├── context/       # AuthContext (Context API)
        └── pages/         # telas da aplicação
```

---

## 🛢️ Modelagem do Banco de Dados

Quatro tabelas com relacionamentos 1:N por chaves estrangeiras:

- **usuarios** — recrutadores (1 usuário → N heróis)
- **guildas** — guildas disponíveis (1 guilda → N heróis)
- **herois** — heróis vinculados a uma guilda e a um recrutador
- **missoes** — eventos vinculados a um herói (1 herói → N missões)

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Node.js instalado
- MySQL instalado e em execução

### 1. Clonar o repositório
```bash
git clone https://github.com/lucas41946-lgtm/projeto-herois.git
cd projeto-herois
```

### 2. Configurar o Banco de Dados
Dentro da pasta `backend/`, execute o script SQL no MySQL:
```bash
mysql -u root -p < database.sql
```

### 3. Configurar o Backend
```bash
cd backend
npm install
```

Crie um arquivo `.env` na pasta `backend/` com:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=portal_herois
DB_SSL=false
JWT_SECRET=sua_chave_secreta
PORT=3000
```

Inicie o servidor:
```bash
npm run dev
```
O backend ficará disponível em `http://localhost:3000`.

### 4. Configurar o Frontend
Em outro terminal:
```bash
cd frontend
npm install
```

Crie um arquivo `.env` na pasta `frontend/` com:
```
VITE_API_URL=http://localhost:3000
```

Inicie a aplicação:
```bash
npm run dev
```
O frontend ficará disponível na porta indicada pelo Vite (geralmente `http://localhost:5173`).

---

## 📋 Funcionalidades

### Autenticação e Segurança
- Cadastro de recrutador com senha protegida por hash (BCrypt)
- Login com emissão de token JWT
- Rotas protegidas por middleware no backend e por React Router no frontend
- Atualização de perfil e troca de senha (exige a senha atual)

### Gerenciamento de Heróis
- Listagem dos heróis pertencentes exclusivamente ao recrutador logado
- Cadastro de heróis vinculados a uma guilda
- Edição e exclusão (dispensa) de heróis
- Ajuste rápido de nível de poder direto no card
- Busca por nome em tempo real e filtro por classe (otimizado com `useMemo`)
- Métricas agregadas: total de heróis, média de poder e guilda mais forte

### Sistema de Missões
- Histórico de missões por herói
- Envio de heróis para novas missões, com descrição, status e recompensa em ouro

---

## 👤 Autor

**Lucas Salcedo** — FIEC 2026
Disciplinas: Linguagem de Programação III & Desenvolvimento Web III
Professor: Gustavo Dias
