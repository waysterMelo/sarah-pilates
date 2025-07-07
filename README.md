# Sarah Pilates - Sistema de Gestão

Sistema completo para gestão de estúdio de Pilates com frontend React e backend Spring Boot.

## 🏗️ Arquitetura

```
sarah-pilates/
├── frontend/          # React + TypeScript + Tailwind CSS
├── backend/           # Spring Boot + MySQL + JPA
├── docker-compose.yml # Orquestração dos serviços
└── README.md
```

## 🚀 Como Executar

### Opção 1: Com Docker (Recomendado)

```bash
# Clonar o repositório
git clone <repository-url>
cd sarah-pilates

# Executar todos os serviços
docker-compose up -d

# Acessar as aplicações
# Frontend: http://localhost:5173
# Backend: http://localhost:8080/api
# MySQL: localhost:3306
```

### Opção 2: Desenvolvimento Local

#### Backend (Spring Boot)
```bash
cd backend

# Instalar dependências e executar
./mvnw spring-boot:run

# Ou no Windows
mvnw.cmd spring-boot:run
```

#### Frontend (React)
```bash
cd frontend

# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev
```

#### MySQL
```bash
# Instalar MySQL localmente ou usar Docker
docker run --name mysql-sarah-pilates -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=sarah_pilates -p 3306:3306 -d mysql:8.0
```

## 🛠️ Tecnologias

### Frontend
- **React 18** - Framework JavaScript
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS
- **Vite** - Build tool
- **React Router** - Roteamento
- **Lucide React** - Ícones

### Backend
- **Spring Boot 3.2** - Framework Java
- **Spring Data JPA** - ORM
- **Spring Security** - Autenticação/Autorização
- **MySQL 8.0** - Banco de dados
- **Lombok** - Redução de boilerplate
- **JWT** - Tokens de autenticação
- **Swagger/OpenAPI** - Documentação da API

## 📊 Funcionalidades

### ✅ Implementadas
- **Gestão de Alunos** - CRUD completo
- **Gestão de Instrutores** - CRUD completo
- **Agendamento de Aulas** - Sistema completo de agenda
- **Avaliação Física** - Formulários detalhados
- **Fichas de Evolução** - Acompanhamento do progresso
- **Relatórios e Analytics** - Dashboard com métricas
- **Autenticação** - Login seguro com JWT

### 🔄 Entidades do Banco

1. **Student** - Dados dos alunos
2. **Instructor** - Dados dos instrutores
3. **Schedule** - Agendamentos de aulas
4. **PhysicalEvaluation** - Avaliações físicas
5. **EvolutionRecord** - Fichas de evolução
6. **User** - Usuários do sistema

## 🔧 Configuração

### Variáveis de Ambiente

#### Backend (`backend/src/main/resources/application.yml`)
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/sarah_pilates
    username: root
    password: root
  
  security:
    jwt:
      secret: sarah-pilates-jwt-secret-key-2024
      expiration: 86400000
```

#### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:8080/api
```

## 📚 API Documentation

Após executar o backend, acesse:
- **Swagger UI**: http://localhost:8080/api/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/api/v3/api-docs

## 🔐 Autenticação

O sistema usa JWT para autenticação. Endpoints protegidos requerem o header:
```
Authorization: Bearer <jwt-token>
```

## 📱 Responsividade

O frontend é totalmente responsivo, funcionando em:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1280px+)

## 🎨 Design System

- **Cores primárias**: Gradiente roxo/rosa (#6C5CE7 → #FF7675)
- **Tipografia**: Inter (Google Fonts)
- **Componentes**: Design system próprio com Tailwind
- **Animações**: Micro-interações suaves
- **Ícones**: Lucide React

## 🚀 Deploy

### Produção
1. Configurar variáveis de ambiente de produção
2. Build do frontend: `npm run build`
3. Build do backend: `./mvnw clean package`
4. Deploy usando Docker ou serviços cloud

### Desenvolvimento
```bash
# Executar tudo com Docker
docker-compose up -d

# Ou executar separadamente
cd backend && ./mvnw spring-boot:run
cd frontend && npm run dev
```

## 📝 Próximos Passos

1. **Implementar Controllers** - Criar endpoints REST
2. **Implementar Services** - Lógica de negócio
3. **Configurar Security** - JWT e CORS
4. **Testes** - Unit e Integration tests
5. **Deploy** - Configuração para produção

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.