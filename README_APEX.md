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

## 📋 Funcionalidades Implementadas (Parte 3)
- [x] **Auditoria Avançada**: Logs detalhados de todas as ações críticas (criação, edição, pagamentos).
- [x] **Relatórios Financeiros**: Visão de faturamento por serviço, lucro líquido e inadimplência.
- [x] **Exportação**: Suporte a exportação de relatórios em formato CSV.
- [x] **Arquitetura Modular**: Implementação de Camada de Serviços e Schemas Zod para validação.
- [x] **Alertas de Dashboard**: Sistema de alertas para contas vencidas (Receber/Pagar).
- [x] **Abstração de Pagamentos**: Interface preparada para integração com provedores reais (Stripe, Asaas).
- [x] **Performance**: Índices de banco de dados otimizados para buscas financeiras.
