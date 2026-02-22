# APEX – Assessoria em Armas - Sistema Administrativo

Sistema web responsivo para gestão de processos, clientes e serviços.

## 🚀 Como Executar

Para rodar o projeto localmente, siga os passos abaixo:

### 1. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto (ou edite o existente) com os seguintes valores:

```env
DATABASE_URL="file:./dev.db"
ADMIN_INITIAL_PASSWORD="sua_senha_segura"
JWT_SECRET="chave_secreta_para_tokens"
NODE_ENV="development"
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Sincronizar Banco de Dados
```bash
npx prisma db push
```

### 4. Alimentar o Banco de Dados (Seed)
Este comando criará o usuário `admin` inicial e os serviços padrão:
```bash
node prisma/seed.js
```

### 5. Rodar em Desenvolvimento
```bash
npm run dev
```

Acesse em: `http://localhost:3000/login`

---

## 🔐 Credenciais Iniciais
- **Usuário:** admin
- **Senha:** (aquela definida em `ADMIN_INITIAL_PASSWORD` no arquivo .env)

## 🛠️ Tecnologias Utilizadas
- **Framework:** Next.js 15 (App Router)
- **Estética:** Tailwind CSS (Dark Mode / Gold)
- **Banco de Dados:** Prisma ORM com SQLite
- **Autenticação:** JWT + BCrypt + Cookies Seguros

## 📋 Funcionalidades Implementadas (Parte 1)
- [x] Login funcional com autenticação segura.
- [x] Middleware de proteção de rotas.
- [x] Logo APEX integrada.
- [x] Dashboard base com estrutura responsiva.
- [x] Seed automático de serviços e admin.
