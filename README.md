# 🍽️ Restaurante Saboroso

Sistema web completo de gerenciamento para restaurantes, com painel administrativo e área pública para clientes.

![Node.js](https://img.shields.io/badge/Node.js-16+-green)
![Express](https://img.shields.io/badge/Express-4.16-blue)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Como Usar](#-como-usar)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Melhorias Implementadas](#-melhorias-implementadas)
- [Contribuindo](#-contribuindo)

---

## ✨ Funcionalidades

### 👥 Área Pública
- 📋 **Visualização do Menu** - Cardápio completo com fotos e preços
- 📅 **Sistema de Reservas** - Reserva de mesas com validação de dados
- 📧 **Formulário de Contato** - Envio de mensagens direto para administradores
- 📰 **Newsletter** - Cadastro para receber novidades por email

### 🔐 Painel Administrativo
- 👨‍💼 **Gestão de Usuários** 
  - CRUD completo de administradores
  - Sistema de login seguro com hash bcrypt
  - Proteção contra auto-exclusão
  - Bloqueio de exclusão do último admin
  
- 🍕 **Gestão de Cardápio**
  - Adicionar, editar e excluir pratos
  - Upload de imagens
  - **Clonar produtos** existentes
  
- 📅 **Gestão de Reservas**
  - Visualização com filtros por data
  - Paginação de resultados
  - Dashboard com gráficos
  
- 📬 **Gestão de Contatos**
  - Visualizar mensagens recebidas
  - Excluir mensagens
  
- 📊 **Dashboard**
  - Estatísticas em tempo real (Socket.io)
  - Gráficos de reservas
  - Contadores de registros

---

## 🚀 Tecnologias

### Backend
- **Node.js** - Ambiente de execução JavaScript
- **Express** - Framework web minimalista
- **MySQL2** - Driver MySQL com suporte a Promises
- **Bcrypt** - Hash seguro de senhas
- **Joi** - Validação de schemas
- **Formidable** - Upload de arquivos
- **Express-Session** - Gerenciamento de sessões
- **Socket.io** - Comunicação em tempo real

### Frontend
- **EJS** - Template engine
- **Bootstrap** - Framework CSS
- **jQuery** - Biblioteca JavaScript
- **AdminLTE** - Template de painel admin
- **Chart.js** - Gráficos interativos

### Infraestrutura
- **Redis** - Armazenamento de sessões
- **Moment.js** - Manipulação de datas
- **Nodemon** - Auto-reload em desenvolvimento

---

## 📦 Pré-requisitos

- **Node.js** >= 16.x
- **MySQL** >= 8.0
- **Redis** >= 6.0
- **NPM** ou **Yarn**

---

## 🔧 Instalação

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/restaurante-saboroso.git
cd restaurante-saboroso
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o banco de dados

Crie o banco de dados MySQL:
```sql
CREATE DATABASE saboroso;
```

Importe as tabelas (se houver arquivo SQL):
```bash
mysql -u root -p saboroso < database.sql
```

Ou crie manualmente:
```sql
CREATE TABLE tb_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE tb_menus (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  photo VARCHAR(255)
);

CREATE TABLE tb_reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  people INT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL
);

CREATE TABLE tb_contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  register TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tb_emails (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  register TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Configure o Redis

Certifique-se que o Redis está rodando:
```bash
redis-server
```

---

## ⚙️ Configuração

### 1. Crie o arquivo `.env`

Copie o exemplo:
```bash
cp .env.example .env
```

### 2. Configure as variáveis de ambiente

```env
# Servidor
NODE_ENV=development
PORT=3000

# Banco de Dados
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=saboroso

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Session
SESSION_SECRET=seu_secret_super_seguro_aqui
```

---

## 🎮 Como Usar

### Desenvolvimento
```bash
npm start
```

O servidor estará rodando em: `http://localhost:3000`

### Produção
```bash
NODE_ENV=production npm start
```

---

## 📂 Estrutura do Projeto

```
restaurante-saboroso/
├── bin/
│   └── www                 # Inicialização do servidor
├── inc/                    # Módulos de negócio
│   ├── admin.js           # Lógica administrativa
│   ├── contacts.js        # Gestão de contatos
│   ├── db.js              # Conexão MySQL
│   ├── emails.js          # Gestão de emails
│   ├── menus.js           # Gestão de cardápio
│   ├── Pagination.js      # Paginação
│   ├── queries.js         # Queries SELECT centralizadas
│   ├── reservations.js    # Gestão de reservas
│   ├── users.js           # Gestão de usuários
│   └── validators.js      # Schemas Joi de validação
├── public/                 # Arquivos estáticos
│   ├── admin/             # Assets do painel admin
│   ├── css/
│   ├── images/
│   └── js/
├── routes/                 # Rotas da aplicação
│   ├── admin.js           # Rotas administrativas
│   └── index.js           # Rotas públicas
├── views/                  # Templates EJS
│   ├── admin/             # Views do painel
│   ├── contacts.ejs
│   ├── index.ejs
│   ├── menus.ejs
│   └── reservations.ejs
├── .env                    # Variáveis de ambiente
├── .env.example           # Exemplo de configuração
├── app.js                 # Configuração principal
├── package.json
└── README.md
```

---

## 🎯 Melhorias Implementadas

### ✅ 1. Hash de Senhas com Bcrypt
- Senhas nunca armazenadas em texto plano
- Hash com salt único e 10 rounds
- Comparação segura no login

### ✅ 2. Queries SELECT Centralizadas
- Arquivo `inc/queries.js` com todas as queries de leitura
- Código organizado e reutilizável
- Fácil manutenção

### ✅ 3. Async/Await nas Routes
- Substituição de `.then()/.catch()` por `async/await`
- Código mais limpo e legível
- Melhor tratamento de erros com `try/catch`

### ✅ 4. Validação com Joi
- Schemas declarativos para formulários
- Mensagens customizadas em português
- Validação de múltiplos campos simultâneos
- Redução de ~70% no código de validação

### ✅ 5. Proteção de Admin
- Bloqueio de auto-exclusão
- Garantia de pelo menos 1 admin no sistema
- Mensagens de erro claras

### ✅ 6. Clonar Produto
- Botão "Clonar" em cada produto
- Modal pré-preenchido com dados
- Nome automático com " - Cópia"
- Reutilização de foto existente

### ✅ 7. Documentação Completa
- README detalhado
- Guias de instalação e configuração
- Estrutura do projeto documentada

---

## 🛡️ Segurança

- ✅ Senhas com hash bcrypt
- ✅ Validação de dados com Joi
- ✅ Proteção contra SQL Injection (prepared statements)
- ✅ Sessões seguras com Redis
- ✅ Cookies HttpOnly
- ✅ Variáveis de ambiente para credenciais

---

## 📝 API Routes

### Públicas
```
GET  /                    - Página inicial
GET  /menus              - Cardápio
GET  /reservations       - Formulário de reservas
POST /reservations       - Criar reserva
GET  /contacts           - Formulário de contato
POST /contacts           - Enviar mensagem
POST /subscribe          - Newsletter
```

### Administrativas (requer login)
```
GET    /admin                          - Dashboard
POST   /admin/login                    - Autenticação
GET    /admin/logout                   - Sair

GET    /admin/users                    - Listar usuários
POST   /admin/users                    - Criar usuário
DELETE /admin/users/:id                - Deletar usuário
POST   /admin/users/password-change    - Alterar senha

GET    /admin/menus                    - Listar cardápio
POST   /admin/menus                    - Criar/editar prato
DELETE /admin/menus/:id                - Deletar prato
GET    /admin/menus/:id/clone          - Clonar prato

GET    /admin/reservations             - Listar reservas
POST   /admin/reservations             - Criar/editar reserva
DELETE /admin/reservations/:id         - Deletar reserva
GET    /admin/reservations/charts      - Dados para gráficos

GET    /admin/contacts                 - Listar contatos
DELETE /admin/contacts/:id             - Deletar contato

GET    /admin/emails                   - Listar emails newsletter
DELETE /admin/emails/:id               - Deletar email
```