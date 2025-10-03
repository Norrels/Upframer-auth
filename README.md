# Upframer Auth API

API de autenticação construída com TypeScript, seguindo princípios de Clean Architecture e Domain-Driven Design (DDD).

## 🏗️ Arquitetura

O projeto segue os princípios da **Clean Architecture** com uma estrutura bem definida em camadas:

```
src/
├── domain/                    # Camada de Domínio
│   ├── entities/             # Entidades de negócio
│   └── ports/                # Interfaces/Contratos
│       └── out/
│           └── persistence/  # Contratos de persistência
├── infrastructure/           # Camada de Infraestrutura
│   └── out/
│       └── persistence/      # Implementações de persistência
│           └── schemas/      # Schemas do banco de dados
├── service/                  # Camada de Aplicação
├── config/                   # Configurações
└── index.ts                  # Ponto de entrada da aplicação
```

### Princípios Aplicados

#### 1. **Clean Architecture**
- **Separação clara de responsabilidades** entre as camadas
- **Inversão de dependência**: camadas internas não dependem de camadas externas
- **Independência de frameworks**: lógica de negócio isolada de detalhes técnicos

#### 2. **Domain-Driven Design (DDD)**
- **Entidades** bem definidas (`User`)
- **Ports e Adapters** para isolamento de infraestrutura
- **Serviços de domínio** para regras de negócio

#### 3. **Hexagonal Architecture (Ports & Adapters)**
- **Ports**: Interfaces que definem contratos (`UserRepository`)
- **Adapters**: Implementações concretas (`UserRepositoryAdapter`)
- Facilita testes e mudanças de tecnologia

#### 4. **SOLID Principles**
- **Single Responsibility**: cada classe tem uma responsabilidade específica
- **Open/Closed**: extensível via interfaces
- **Liskov Substitution**: adapters podem ser substituídos
- **Interface Segregation**: interfaces específicas e coesas
- **Dependency Inversion**: dependências abstratas, não concretas

## 🚀 Tecnologias

### Core
- **[Bun](https://bun.sh/)**: Runtime JavaScript/TypeScript ultra-rápido
- **[Elysia](https://elysiajs.com/)**: Framework web performático para Bun
- **[TypeScript](https://www.typescriptlang.org/)**: Tipagem estática e desenvolvimento robusto

### Banco de Dados
- **[PostgreSQL](https://postgresql.org/)**: Banco de dados relacional confiável
- **[Drizzle ORM](https://orm.drizzle.team/)**: Type-safe ORM com excelente DX
- **Drizzle Kit**: Ferramentas de migração e schema management

### Autenticação & Segurança
- **[JsonWebToken (JWT)](https://jwt.io/)**: Tokens de autenticação stateless
- **[bcryptjs](https://github.com/dcodeIO/bcrypt.js)**: Hash seguro de senhas
- **[Zod](https://zod.dev/)**: Validação de schema runtime

### Documentação & DevX
- **[OpenAPI](https://swagger.io/specification/)**: Documentação automática da API
- **Swagger UI**: Interface interativa para testes

### Containerização
- **[Docker](https://docker.com/)**: Containerização da aplicação
- **Docker Compose**: Orquestração de serviços (app + postgres)

## 📋 Funcionalidades

### Endpoints Disponíveis

#### Health Check
- `GET /health` - Verificação de saúde da aplicação

#### Autenticação
- `POST /auth/register` - Registro de novos usuários
- `POST /auth/login` - Login e geração de JWT

## 🛠️ Comandos Disponíveis

```bash
# Desenvolvimento
bun run dev              # Inicia em modo watch

# Banco de dados
bun run db:studio        # Interface visual do Drizzle
bun run migrate:push     # Aplica mudanças no schema

# Testes
bun test                 # Executa testes com coverage
```

## 📝 Configuração

### Variáveis de Ambiente
```env
DATABASE_URL=postgresql://user:pass@host:port/db
JWT_SECRET=your-secret-key
PORT=3335
NODE_ENV=production
```

## 📚 Estrutura de Camadas

### Domain Layer
```typescript
// Entidades puras, sem dependências externas
interface User {
  id: string;
  email: string;
  username: string;
  // ...
}
```

### Application Layer
```typescript
// Orquestra casos de uso, coordena domain e infrastructure
class AuthService {
  constructor(private repository: UserRepository) {}
  // ...
}
```

### Infrastructure Layer
```typescript
// Implementações concretas, detalhes técnicos
class UserRepositoryAdapter implements UserRepository {
  // Implementação com Drizzle ORM
}
```
