# 🎫 Sistema de Soporte - Cliente (Frontend)

Sistema de gestión de tickets de soporte técnico desarrollado con React, TypeScript y Vite. Permite a los clientes crear solicitudes, al equipo de soporte gestionarlas, y a los administradores supervisar todo el sistema.

## 🌐 Despliegue en Producción

**URL de Producción (Netlify):** [https://support-system-pt2025.netlify.app]

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Arquitectura](#-arquitectura)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#️-configuración)
- [Ejecución](#-ejecución)
- [Endpoints de la API](#-endpoints-de-la-api)
- [Roles y Permisos](#-roles-y-permisos)
- [Estructura del Proyecto](#-estructura-del-proyecto)

---

## ✨ Características

### 🔐 Sistema de Autenticación
- Login con validación de credenciales
- Protección de rutas por rol (CLIENT, SUPPORT, ADMIN)
- Redirección automática según rol del usuario
- Persistencia de sesión con Zustand

### 👤 Rol: Cliente (CLIENT)
- ✅ Crear nuevas solicitudes de soporte
- ✅ Ver historial de solicitudes propias
- ✅ Ver detalles de cada solicitud
- ✅ Agregar respuestas a solicitudes
- ✅ Ver estado y prioridad de tickets
- ✅ Dashboard con estadísticas personales

### 👨‍💼 Rol: Soporte (SUPPORT)
- ✅ Ver todas las solicitudes del sistema
- ✅ Filtrar solicitudes por estado, prioridad y categoría
- ✅ Actualizar estado de solicitudes
- ✅ Responder a tickets de clientes
- ✅ Sugerencias de respuestas con IA (Hugging Face)
- ✅ Dashboard con métricas de trabajo

### 👨‍💻 Rol: Administrador (ADMIN)
- ✅ Gestión completa de usuarios (CRUD)
- ✅ Activar/desactivar usuarios
- ✅ Ver todas las solicitudes
- ✅ Reportes y estadísticas en tiempo real
- ✅ Gráficos de tendencias y métricas
- ✅ Dashboard con visión general del sistema

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Cliente    │  │   Soporte    │  │    Admin     │         │
│  │  Dashboard   │  │  Dashboard   │  │  Dashboard   │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                  │                  │                  │
│         └──────────────────┴──────────────────┘                 │
│                            │                                     │
│                    ┌───────▼────────┐                           │
│                    │  Protected     │                           │
│                    │  Routes        │                           │
│                    │  + Auth Guard  │                           │
│                    └───────┬────────┘                           │
│                            │                                     │
│                    ┌───────▼────────┐                           │
│                    │  API Client    │                           │
│                    │  (Axios)       │                           │
│                    └───────┬────────┘                           │
└────────────────────────────┼────────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   REST API      │
                    │   (Backend)     │
                    │   Port: 3000    │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   Database      │
                    │   (PostgreSQL)  │
                    └─────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    Servicios Externos                            │
│                                                                  │
│  ┌──────────────────────────────────────────────────┐          │
│  │  Hugging Face API (IA para sugerencias)          │          │
│  └──────────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

📊 **Ver diagrama detallado:** [ARCHITECTURE.md](./ARCHITECTURE.md)

> El archivo ARCHITECTURE.md incluye:
> - Diagramas en formato Mermaid (visualizables en GitHub)
> - Instrucciones para crear diagramas en Draw.io
> - Diagramas de flujo de autenticación y datos
> - Arquitectura de componentes

### Flujo de Datos

```
Usuario → Login → Auth Guard → Dashboard (según rol)
                       ↓
                  API Client
                       ↓
                  Backend API
                       ↓
                   Database
```

---

## 🛠️ Tecnologías

### Core
- **React 19.1.1** - Biblioteca UI
- **TypeScript 5.7.3** - Tipado estático
- **Vite 7.1.10** - Build tool y dev server

### Routing & State
- **React Router DOM 7.1.3** - Enrutamiento
- **Zustand 5.0.8** - Estado global

### UI & Styling
- **Tailwind CSS 4.1.12** - Estilos
- **Shadcn/UI** - Componentes
- **Lucide React 0.469.0** - Iconos
- **Recharts 3.2.1** - Gráficos

### Forms & Validation
- **React Hook Form 7.65.0** - Gestión de formularios
- **Zod 4.1.12** - Validación de esquemas

### HTTP & Date
- **Axios 1.12.2** - Cliente HTTP
- **date-fns 4.1.0** - Manejo de fechas

### Notifications
- **Sonner 2.0.7** - Toasts y notificaciones

---

## 📦 Requisitos Previos

Asegúrate de tener instalado:

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0 (recomendado) o npm >= 9.0.0
- **Backend API** corriendo en `http://localhost:3000`

---

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone [https://github.com/kevinguzman420/support-system-pt2025-client]
cd pt2025-client
```

### 2. Instalar Dependencias

```bash
# Con pnpm (recomendado)
pnpm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# URL del backend API
VITE_API_URL=http://localhost:3000/api

# API Key de Hugging Face (opcional, para sugerencias con IA)
VITE_HUGGINGFACE_API_KEY=tu_api_key_aqui
```

---

## ⚙️ Configuración

### Configuración de la API

El archivo `/src/axios.config.ts` configura el cliente HTTP:

```typescript
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});
```

### Configuración de Hugging Face (Opcional)

Para habilitar las sugerencias de respuestas con IA:

1. Crea una cuenta en [Hugging Face](https://huggingface.co/)
2. Genera un token con permisos de **escritura**
3. Agrégalo al archivo `.env` como `VITE_HUGGINGFACE_API_KEY`

---

## 🎮 Ejecución

### Modo Desarrollo

```bash
pnpm dev
```

La aplicación estará disponible en: **http://localhost:5173**

### Build de Producción

```bash
pnpm build
```

Los archivos compilados se generarán en `/dist`

### Preview del Build

```bash
pnpm preview
```

### Linting

```bash
pnpm lint
```

---

## 🔌 Endpoints de la API

Base URL: `http://localhost:3000/api`

### 🔓 Autenticación

| Método | Endpoint | Descripción | Body | Auth | Respuesta |
|--------|----------|-------------|------|------|-----------|
| POST | `/public/auth/login` | Iniciar sesión | `{ email, password }` | ❌ | `{ success, user }` |
| POST | `/public/auth/logout` | Cerrar sesión | - | ✅ | `{ success, message }` |

**Ejemplo Login:**
```bash
curl -X POST http://localhost:3000/api/public/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"client@example.com","password":"client123"}'
```

---

### 🎫 Solicitudes (Requests)

| Método | Endpoint | Descripción | Body | Roles | Respuesta |
|--------|----------|-------------|------|-------|-----------|
| GET | `/private/requests` | Obtener solicitudes del usuario actual | - | CLIENT | `{ success, requests[] }` |
| GET | `/private/requests/:id` | Obtener detalle de una solicitud | - | ALL | `{ success, request }` |
| GET | `/private/requests/all` | Obtener todas las solicitudes del sistema | - | ADMIN, SUPPORT | `{ success, requests[] }` |
| POST | `/private/requests` | Crear nueva solicitud | Ver abajo | CLIENT | `{ success, message }` |
| PATCH | `/private/requests/:id` | Actualizar estado de solicitud | `{ status }` | ADMIN, SUPPORT | `{ success, request }` |

**Body para Crear Solicitud:**
```json
{
  "title": "Problema con acceso",
  "description": "No puedo acceder a mi cuenta",
  "category": "TECHNICAL_SUPPORT",
  "priority": "HIGH"
}
```

**Categorías disponibles:**
- `TECHNICAL_SUPPORT` - Soporte Técnico
- `GENERAL_INQUIRY` - Consulta General
- `ACCESS_ISSUE` - Problema de Acceso
- `BILLING` - Facturación
- `OTHER` - Otro

**Prioridades disponibles:**
- `LOW` - Baja
- `MEDIUM` - Media
- `HIGH` - Alta
- `CRITICAL` - Crítica

**Estados disponibles:**
- `PENDING` - Pendiente
- `IN_PROGRESS` - En Progreso
- `RESOLVED` - Resuelto
- `CLOSED` - Cerrado
- `CANCELLED` - Cancelado

**Ejemplo Crear Solicitud:**
```bash
curl -X POST http://localhost:3000/api/private/requests \
  -H "Content-Type: application/json" \
  -H "Cookie: session_cookie" \
  -d '{
    "title": "Error al iniciar sesión",
    "description": "No puedo acceder con mi contraseña",
    "category": "ACCESS_ISSUE",
    "priority": "HIGH"
  }'
```

**Ejemplo Actualizar Estado:**
```bash
curl -X PATCH http://localhost:3000/api/private/requests/cmgtkwca8000hs52zxw4oscgn \
  -H "Content-Type: application/json" \
  -H "Cookie: session_cookie" \
  -d '{"status": "IN_PROGRESS"}'
```

---

### 💬 Respuestas (Responses)

| Método | Endpoint | Descripción | Body | Roles | Respuesta |
|--------|----------|-------------|------|-------|-----------|
| POST | `/private/responses` | Agregar respuesta a una solicitud | `{ requestId, content }` | ALL | `{ success, response }` |

**Ejemplo Agregar Respuesta:**
```bash
curl -X POST http://localhost:3000/api/private/responses \
  -H "Content-Type: application/json" \
  -H "Cookie: session_cookie" \
  -d '{
    "requestId": "cmgtkwca8000hs52zxw4oscgn",
    "content": "Hemos revisado tu caso y estamos trabajando en una solución"
  }'
```

---

### 👥 Usuarios (Users)

| Método | Endpoint | Descripción | Body | Roles | Respuesta |
|--------|----------|-------------|------|-------|-----------|
| GET | `/private/admin/users` | Listar todos los usuarios | - | ADMIN | `{ success, users[] }` |
| POST | `/private/admin/users` | Crear nuevo usuario | Ver abajo | ADMIN | `{ success, user }` |
| PATCH | `/private/admin/users/:id` | Actualizar usuario | Ver abajo | ADMIN | `{ success, user }` |

**Body para Crear Usuario:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "role": "CLIENT"
}
```

**Body para Actualizar Usuario:**
```json
{
  "name": "Juan Pérez Actualizado",
  "password": "newpassword123",  // Opcional
  "role": "SUPPORT",
  "active": true
}
```

**Roles disponibles:**
- `CLIENT` - Cliente
- `SUPPORT` - Soporte
- `ADMIN` - Administrador

**Ejemplo Crear Usuario:**
```bash
curl -X POST http://localhost:3000/api/private/admin/users \
  -H "Content-Type: application/json" \
  -H "Cookie: session_cookie" \
  -d '{
    "name": "María García",
    "email": "maria@example.com",
    "password": "maria123",
    "role": "SUPPORT"
  }'
```

**Ejemplo Actualizar Usuario:**
```bash
curl -X PATCH http://localhost:3000/api/private/admin/users/user_id_123 \
  -H "Content-Type: application/json" \
  -H "Cookie: session_cookie" \
  -d '{
    "name": "María García López",
    "active": false
  }'
```

---

### 📋 Estructura de Respuestas

Todas las respuestas de la API siguen este formato:

**Éxito:**
```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": { /* ... */ }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Descripción del error"
}
```

---

### 🔐 Autenticación en Requests

El sistema usa **cookies HTTP-only** para la autenticación. El frontend está configurado con:

```typescript
// src/axios.config.ts
withCredentials: true
```

Esto permite que las cookies se envíen automáticamente en cada request.



---

## 🔐 Roles y Permisos

### CLIENT (Cliente)
**Acceso:**
- `/dashboard/cliente/*`

**Permisos:**
- ✅ Crear solicitudes
- ✅ Ver sus propias solicitudes
- ✅ Agregar respuestas
- ❌ Ver solicitudes de otros
- ❌ Cambiar estados
- ❌ Gestionar usuarios

### SUPPORT (Soporte)
**Acceso:**
- `/dashboard/soporte/*`

**Permisos:**
- ✅ Ver todas las solicitudes
- ✅ Actualizar estados
- ✅ Responder solicitudes
- ✅ Usar sugerencias de IA
- ❌ Gestionar usuarios
- ❌ Ver reportes completos

### ADMIN (Administrador)
**Acceso:**
- `/dashboard/admin/*`

**Permisos:**
- ✅ Todo lo de SUPPORT
- ✅ Gestionar usuarios (CRUD)
- ✅ Ver reportes completos
- ✅ Ver estadísticas del sistema
- ✅ Acceso total al sistema

---

## 📁 Estructura del Proyecto

```
pt2025-client/
├── public/
│   └── images/           # Imágenes estáticas
├── src/
│   ├── api/              # Funciones de API
│   │   ├── login.api.ts
│   │   ├── logout.api.ts
│   │   ├── requests.api.ts
│   │   ├── responses.api.ts
│   │   ├── users.api.ts
│   │   └── ai-suggestions.api.ts
│   ├── components/       # Componentes React
│   │   ├── admin/        # Componentes de admin
│   │   │   ├── DashboardAdmin.tsx
│   │   │   ├── GestionUsuarios.tsx
│   │   │   └── Reports.tsx
│   │   ├── client/       # Componentes de cliente
│   │   │   ├── DashboardClient.tsx
│   │   │   ├── MisSolicitudes.tsx
│   │   │   └── NuevaSolicitud.tsx
│   │   ├── soporte/      # Componentes de soporte
│   │   │   └── DashboardSoporte.tsx
│   │   ├── layouts/      # Layouts
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── AutoLayout.tsx
│   │   ├── ui/           # Componentes UI (Shadcn)
│   │   ├── Login.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── PublicRoute.tsx
│   │   └── ...
│   ├── pages/            # Páginas
│   │   ├── DetalleSolicitud.tsx
│   │   └── Perfil.tsx
│   ├── store/            # Estado global (Zustand)
│   │   └── user.store.ts
│   ├── lib/              # Utilidades
│   │   ├── mock-data.ts
│   │   └── utils.ts
│   ├── types.ts          # Tipos TypeScript
│   ├── axios.config.ts   # Configuración Axios
│   ├── App.tsx           # Componente principal
│   └── main.tsx          # Punto de entrada
├── .env                  # Variables de entorno
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

## 🧪 Usuarios de Prueba

El sistema incluye usuarios de prueba (verificar con backend):

```javascript
// Admin
email: admin@example.com
password: admin123

// Soporte
email: support@example.com
password: support123

// Cliente
email: client@example.com
password: client123
```

---

## 🎨 Temas y Estilos

El proyecto usa **Tailwind CSS** con variables CSS personalizadas definidas en `/src/index.css`:

- Modo claro/oscuro (preparado para implementación futura)
- Paleta de colores personalizada
- Componentes consistentes con Shadcn/UI

---

## 📊 Características Destacadas

### 1. Sistema de Protección de Rutas
- Componente `ProtectedRoute` que valida autenticación y roles
- Componente `PublicRoute` para rutas públicas
- Redirección automática según permisos

### 2. Dashboard Dinámico
- Estadísticas en tiempo real
- Gráficos interactivos con Recharts
- Datos calculados desde la API

### 3. Gestión de Formularios
- Validación con Zod
- React Hook Form para mejor UX
- Feedback visual con Sonner

### 4. Sugerencias con IA
- Integración con Hugging Face
- Múltiples modelos de fallback
- Respuestas contextuales

---

## 🐛 Solución de Problemas

### Error de CORS (Realizado!)
Asegúrate de que el backend tenga configurado CORS para `http://localhost:5173`

### Variables de entorno no cargadas
Reinicia el servidor de desarrollo después de modificar `.env`

### Error de autenticación (Realizado!)
Verifica que `withCredentials: true` esté en la configuración de Axios

---

## 📝 Licencia

Este proyecto es parte de una prueba técnica.

---

**URL de producción:** [https://support-system-pt2025.netlify.app]

## 📄 Licencia

Este proyecto fue desarrollado como prueba técnica 2025 para CIFRA.

## 👥 Autor

**Kevin Guzmán**
- Email: kevinjguzmano777@outlook.com
- GitHub: [@kevinguzman420](https://github.com/kevinguzman420)
- Deplegado en[Netlify](https://netlify.com) 

Desarrollado con ❤️ por Kevin Guzmán (Powered by AI)
---

## 🔗 Enlaces Útiles

- [Documentación de React](https://react.dev/)
- [Documentación de Vite](https://vitejs.dev/)
- [Shadcn/UI](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)

import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
