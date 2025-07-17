# E-commerce Flow Test

Una aplicación de e-commerce construida con NestJS, Prisma y PostgreSQL siguiendo principios de **Arquitectura Hexagonal** y **Railway Oriented Programming (ROP)**.

## 🚀 Características

- ✅ **API REST** con NestJS
- ✅ **Base de datos** PostgreSQL con Prisma ORM
- ✅ **Arquitectura Hexagonal** (Ports & Adapters)
- ✅ **Railway Oriented Programming** para manejo de errores
- ✅ **Validación** de datos con class-validator
- ✅ **Documentación** automática con Swagger
- ✅ **Testing** configurado con Jest
- ✅ **TypeScript** para type safety

## 📋 Módulos Implementados

### 🛍️ Products
- Gestión completa de productos
- Control de inventario/stock
- CRUD operations

### 👥 Customers  
- Gestión de clientes
- Validación de emails únicos
- CRUD operations

### 🔄 Orders (En desarrollo)
- Proceso de compra
- Integración con Wompi (Sandbox)
- Gestión de transacciones

## 🛠️ Stack Tecnológico

- **Backend**: NestJS 11.x
- **Base de datos**: PostgreSQL
- **ORM**: Prisma 6.x
- **Validación**: class-validator & class-transformer
- **Documentación**: Swagger/OpenAPI
- **Testing**: Jest
- **Linting**: ESLint + Prettier

## 📦 Instalación

### Prerequisitos
- Node.js 18+ 
- PostgreSQL 12+
- npm o yarn

### 1. Clonar repositorio
```bash
git clone <repository-url>
cd ecommerce-flow-test
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
# Crear archivo .env
cp .env.example .env
```

Configurar las siguientes variables:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce_db?schema=public"

# Wompi API (Sandbox)
WOMPI_SANDBOX_URL="https://api-sandbox.co.uat.wompi.dev/v1"
WOMPI_PUBLIC_KEY="pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7"
WOMPI_PRIVATE_KEY="prv_stagtest_5i0ZGIGiFcDQifYsXxvsny7Y37tKqFWg"
WOMPI_INTEGRITY_KEY="stagtest_integrity_nAIBuqayW70XpUqJS4qf4STYiISd89Fp"
```

### 4. Configurar base de datos
```bash
# Generar cliente de Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# (Opcional) Seed de datos iniciales
npx prisma db seed
```

### 5. Ejecutar aplicación
```bash
# Desarrollo
npm run start:dev

# Producción
npm run start:prod
```

La aplicación estará disponible en: `http://localhost:3000`

## 📖 API Documentation

La documentación interactiva de la API está disponible en:
```
http://localhost:3000/api
```

## 🗄️ Estructura del Proyecto

```
src/
├── core/                          # Core infrastructure
│   └── prisma/
│       ├── schema.prisma          # Database schema
│       ├── prisma.service.ts      # Prisma service
│       └── prisma.module.ts       # Prisma module
├── shared/                        # Shared utilities
│   └── types/
│       ├── result.type.ts         # Railway Oriented Programming
│       └── app-error.type.ts      # Error handling
├── modules/                       # Business modules
│   ├── products/                  # Products module
│   │   ├── adapters/              # Infrastructure adapters
│   │   ├── application/           # Use cases & services
│   │   ├── dto/                   # Data Transfer Objects
│   │   └── ports/                 # Interfaces (hexagonal)
│   │       ├── in/                # Input ports (controllers)
│   │       └── out/               # Output ports (repositories)
│   └── customers/                 # Customers module
│       ├── adapters/
│       ├── application/
│       ├── dto/
│       └── ports/
└── main.ts                       # Application entry point
```

## 🏗️ Arquitectura

### Hexagonal Architecture (Ports & Adapters)

```
┌─────────────────────────────────────────────────────────────┐
│                     Controllers (Input Ports)               │
├─────────────────────────────────────────────────────────────┤
│                     Use Cases (Business Logic)              │
├─────────────────────────────────────────────────────────────┤
│                  Repository Ports (Interfaces)              │
├─────────────────────────────────────────────────────────────┤
│               Repository Adapters (Prisma)                  │
└─────────────────────────────────────────────────────────────┘
```

### Railway Oriented Programming

```typescript
// Ejemplo de ROP
return this.validateData(input)
  .then(result => result.isSuccess() ? this.processData(result.value) : Promise.resolve(result))
  .then(result => result.isSuccess() ? this.saveData(result.value) : Promise.resolve(result));
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# Test coverage
npm run test:cov

# E2E tests  
npm run test:e2e

# Watch mode
npm run test:watch
```

## 📊 Database Schema

### Products
```sql
CREATE TABLE products (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT NOT NULL,
  price       DECIMAL(10,2) NOT NULL,
  stock       INTEGER NOT NULL,
  imageUrl    TEXT,
  createdAt   TIMESTAMP DEFAULT NOW(),
  updatedAt   TIMESTAMP DEFAULT NOW()
);
```

### Customers
```sql
CREATE TABLE customers (
  id        TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  email     TEXT UNIQUE NOT NULL,
  firstName TEXT NOT NULL,
  lastName  TEXT NOT NULL,
  phone     TEXT,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

## 🔗 API Endpoints

### Products
- `GET /products` - Obtener todos los productos
- `GET /products/:id` - Obtener producto por ID
- `POST /products` - Crear producto
- `PUT /products/:id` - Actualizar producto
- `DELETE /products/:id` - Eliminar producto
- `PUT /products/:id/stock` - Actualizar stock

### Customers
- `GET /customers` - Obtener todos los clientes
- `GET /customers/:id` - Obtener cliente por ID
- `GET /customers/by-email/:email` - Obtener cliente por email
- `POST /customers` - Crear cliente
- `PUT /customers/:id` - Actualizar cliente
- `DELETE /customers/:id` - Eliminar cliente

## 🚧 En Desarrollo

### Orders & Payments
- [ ] Creación de órdenes
- [ ] Integración con Wompi API
- [ ] Procesamiento de pagos
- [ ] Gestión de entregas
- [ ] Actualización automática de stock

### Features Adicionales
- [ ] Autenticación JWT
- [ ] Rate limiting
- [ ] Logs estructurados
- [ ] Métricas y monitoring
- [ ] Cache con Redis
- [ ] Upload de imágenes

## 🔒 Seguridad

- Validación de entrada con class-validator
- Sanitización de datos
- Variables de entorno para secrets
- Headers de seguridad (planeado)
- HTTPS (planeado)

## 📝 Scripts Disponibles

```bash
npm run build          # Compilar aplicación
npm run start          # Iniciar aplicación
npm run start:dev      # Modo desarrollo con watch
npm run start:debug    # Modo debug
npm run test           # Ejecutar tests
npm run test:cov       # Coverage de tests
npm run lint           # Linting con ESLint
npm run format         # Formatear código con Prettier
```

## 🔧 Comandos de Base de Datos

```bash
# Generar cliente Prisma
npx prisma generate

# Crear migración
npx prisma migrate dev --name migration-name

# Aplicar migraciones
npx prisma migrate deploy

# Reset de base de datos
npx prisma migrate reset

# Visualizar base de datos
npx prisma studio
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/amazing-feature`)
3. Commit cambios (`git commit -m 'Add amazing feature'`)
4. Push a la branch (`git push origin feature/amazing-feature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto es privado y no tiene licencia pública.

## 👨‍💻 Autor

Desarrollado como prueba técnica para proceso de selección.

---

⚡ **Powered by NestJS + Prisma + PostgreSQL**