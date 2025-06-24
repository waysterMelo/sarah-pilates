# Sarah Pilates API

API RESTful completa para o sistema de gestão do estúdio de Pilates "Sarah Pilates".

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **TypeScript** - Tipagem estática
- **Prisma** - ORM para banco de dados
- **MySQL** - Banco de dados
- **JWT** - Autenticação
- **Zod** - Validação de schemas
- **Nodemailer** - Envio de emails
- **Multer** - Upload de arquivos

## 📋 Pré-requisitos

- Node.js 18+
- MySQL 8.0+
- npm ou yarn

## ⚙️ Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd backend
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o MySQL**

Crie o banco de dados no MySQL:
```sql
CREATE DATABASE sarah_pilates;
CREATE USER 'sarah_user'@'localhost' IDENTIFIED BY 'senha_forte';
GRANT ALL PRIVILEGES ON sarah_pilates.* TO 'sarah_user'@'localhost';
FLUSH PRIVILEGES;
```

4. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
DATABASE_URL="mysql://sarah_user:senha_forte@localhost:3306/sarah_pilates"
JWT_SECRET="your-super-secret-jwt-key"
# ... outras variáveis
```

5. **Execute as migrações do banco**
```bash
npm run db:migrate
```

6. **Execute o seed (dados iniciais)**
```bash
npm run db:seed
```

7. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3001`

## 🏗️ Estrutura do Projeto

```
src/
├── config/          # Configurações (database, auth, email)
├── controllers/     # Controladores das rotas
├── middleware/      # Middlewares (auth, validation, error)
├── routes/          # Definição das rotas
├── services/        # Lógica de negócio
├── schemas/         # Schemas de validação (Zod)
├── utils/           # Utilitários
└── app.ts          # Configuração principal da aplicação
```

## 📚 API Endpoints

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `POST /api/auth/refresh` - Renovar token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/profile` - Perfil do usuário
- `PUT /api/auth/profile` - Atualizar perfil

### Alunos
- `GET /api/students` - Listar alunos
- `POST /api/students` - Criar aluno
- `GET /api/students/:id` - Obter aluno
- `PUT /api/students/:id` - Atualizar aluno
- `DELETE /api/students/:id` - Excluir aluno
- `GET /api/students/search` - Buscar alunos

### Fichas de Evolução
- `GET /api/evolution-records` - Listar fichas
- `POST /api/evolution-records` - Criar ficha
- `GET /api/evolution-records/:id` - Obter ficha
- `PUT /api/evolution-records/:id` - Atualizar ficha
- `DELETE /api/evolution-records/:id` - Excluir ficha
- `GET /api/evolution-records/student/:studentId` - Fichas por aluno

### Dashboard
- `GET /api/dashboard/stats` - Estatísticas gerais
- `GET /api/dashboard/revenue` - Dados de receita
- `GET /api/dashboard/schedules/today` - Agendamentos hoje
- `GET /api/dashboard/schedules/upcoming` - Próximos agendamentos

## 🔐 Autenticação

A API utiliza JWT (JSON Web Tokens) para autenticação. Inclua o token no header das requisições:

```
Authorization: Bearer <your-jwt-token>
```

## 🛡️ Níveis de Acesso

- **ADMIN** - Acesso total ao sistema
- **INSTRUCTOR** - Pode gerenciar alunos, agendamentos e fichas
- **RECEPTIONIST** - Acesso limitado a agendamentos e consultas

## 📧 Sistema de Email

O sistema envia emails automaticamente para:
- Confirmação de agendamentos
- Lembretes de aulas
- Recuperação de senha

Configure as variáveis de email no `.env`:
```env
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
```

## 📁 Upload de Arquivos

Suporte para upload de:
- Fotos de perfil (alunos/instrutores)
- Anexos de avaliações
- Documentos diversos

Arquivos são salvos em `/uploads` com organização por tipo.

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch
```

## 🏗️ Build para Produção

```bash
# Build da aplicação
npm run build

# Iniciar aplicação em produção
npm start
```

## 📊 Monitoramento

### Health Check
```
GET /health
```

### Logs
Os logs são automaticamente gerados em development e incluem:
- Queries do Prisma
- Erros detalhados
- Requests HTTP

## 🔧 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm start` - Iniciar aplicação
- `npm run db:migrate` - Executar migrações
- `npm run db:seed` - Popular banco com dados iniciais
- `npm run db:studio` - Abrir Prisma Studio
- `npm test` - Executar testes

## 🚀 Deploy

### Configuração para Produção

1. **Variáveis de ambiente**
   - Configure todas as variáveis necessárias
   - Use senhas fortes para JWT_SECRET
   - Configure email de produção

2. **Banco de dados**
   - Configure MySQL em produção
   - Execute migrações
   - Execute seed se necessário

3. **Servidor**
   - Use PM2 ou similar para gerenciamento de processos
   - Configure nginx como proxy reverso
   - Configure SSL/HTTPS

### Exemplo com PM2
```bash
npm install -g pm2
npm run build
pm2 start dist/app.js --name "sarah-pilates-api"
```

### Configuração MySQL para Produção

```sql
-- Criar usuário de produção
CREATE USER 'sarah_prod'@'%' IDENTIFIED BY 'senha_super_forte';
GRANT ALL PRIVILEGES ON sarah_pilates.* TO 'sarah_prod'@'%';

-- Configurações de segurança recomendadas
SET GLOBAL sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO';
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

Para dúvidas ou suporte, entre em contato:
- Email: contato@sarahpilates.com
- GitHub Issues: [Link para issues]

## 🔄 Migrações e Manutenção

### Backup do Banco
```bash
mysqldump -u sarah_user -p sarah_pilates > backup.sql
```

### Restaurar Backup
```bash
mysql -u sarah_user -p sarah_pilates < backup.sql
```

### Verificar Status do Banco
```bash
npm run db:studio
```

---

Desenvolvido com ❤️ para o Sarah Pilates Studio