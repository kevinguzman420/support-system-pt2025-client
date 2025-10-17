# Diagrama de Arquitectura - Sistema de Soporte

## Diagrama en Mermaid

```mermaid
graph TB
    subgraph "Frontend - React"
        A[Login Page] --> B{Auth Guard}
        B -->|CLIENT| C[Dashboard Cliente]
        B -->|SUPPORT| D[Dashboard Soporte]
        B -->|ADMIN| E[Dashboard Admin]
        
        C --> F[Crear Solicitud]
        C --> G[Mis Solicitudes]
        C --> H[Ver Detalle]
        
        D --> I[Todas las Solicitudes]
        D --> J[Responder Tickets]
        D --> K[Actualizar Estados]
        
        E --> L[Gestión Usuarios]
        E --> M[Reportes]
        E --> N[Todas las Solicitudes]
        
        F --> O[API Client - Axios]
        G --> O
        H --> O
        I --> O
        J --> O
        K --> O
        L --> O
        M --> O
        N --> O
    end
    
    subgraph "Backend API"
        O --> P[Express Server :3000]
        P --> Q[Auth Middleware]
        P --> R[Role Middleware]
        
        Q --> S[Request Controller]
        Q --> T[User Controller]
        Q --> U[Response Controller]
        
        S --> V[(PostgreSQL Database)]
        T --> V
        U --> V
    end
    
    subgraph "Servicios Externos"
        J -.->|Sugerencias IA| W[Hugging Face API]
    end
    
    style A fill:#e1f5fe
    style B fill:#fff9c4
    style C fill:#c8e6c9
    style D fill:#c8e6c9
    style E fill:#c8e6c9
    style O fill:#ffccbc
    style P fill:#f8bbd0
    style V fill:#d1c4e9
    style W fill:#ffe0b2
```

## Diagrama de Flujo de Autenticación

```mermaid
sequenceDiagram
    participant U as Usuario
    participant L as Login Page
    participant A as Auth Guard
    participant API as Backend API
    participant DB as Database
    
    U->>L: Ingresa credenciales
    L->>API: POST /api/public/auth/login
    API->>DB: Validar credenciales
    DB-->>API: Usuario válido
    API-->>L: Token + Datos usuario
    L->>A: Redirigir con sesión
    A->>A: Verificar rol
    A-->>U: Mostrar Dashboard (según rol)
```

## Diagrama de Flujo de Solicitudes

```mermaid
sequenceDiagram
    participant C as Cliente
    participant S as Soporte
    participant API as Backend API
    participant DB as Database
    
    C->>API: POST /api/private/requests
    API->>DB: Crear solicitud
    DB-->>API: Solicitud creada
    API-->>C: Confirmación
    
    S->>API: GET /api/private/requests/all
    API->>DB: Obtener todas
    DB-->>API: Lista de solicitudes
    API-->>S: Mostrar solicitudes
    
    S->>API: PATCH /api/private/requests/:id
    API->>DB: Actualizar estado
    DB-->>API: Estado actualizado
    API-->>S: Confirmación
```

## Arquitectura de Componentes

```mermaid
graph LR
    subgraph "Capa de Presentación"
        A[Components]
        B[Pages]
        C[Layouts]
    end
    
    subgraph "Capa de Lógica"
        D[API Clients]
        E[Store - Zustand]
        F[Protected Routes]
    end
    
    subgraph "Capa de Datos"
        G[Axios Config]
        H[Types]
    end
    
    A --> D
    B --> D
    C --> E
    D --> G
    F --> E
    D --> H
    E --> H
```

---

## Para Draw.io

### Instrucciones para crear el diagrama:

1. **Abre Draw.io** (https://app.diagrams.net/)
2. **Crea un nuevo diagrama**
3. **Usa las siguientes formas:**

#### Capas Principales:

**Capa Frontend:**
```
┌─────────────────────────────────────────┐
│         FRONTEND (React + TS)           │
│                                         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐│
│  │ Cliente │  │ Soporte │  │  Admin  ││
│  │Dashboard│  │Dashboard│  │Dashboard││
│  └────┬────┘  └────┬────┘  └────┬────┘│
│       └────────────┴─────────────┘     │
│                    │                    │
│            ┌───────▼────────┐          │
│            │  Auth Guard    │          │
│            │  (Protected    │          │
│            │   Routes)      │          │
│            └───────┬────────┘          │
│                    │                    │
│            ┌───────▼────────┐          │
│            │   API Client   │          │
│            │    (Axios)     │          │
│            └───────┬────────┘          │
└────────────────────┼────────────────────┘
                     │
```

**Capa Backend:**
```
                ┌────▼─────┐
                │  REST    │
                │   API    │
                │ :3000    │
                └────┬─────┘
                     │
                ┌────▼─────┐
                │PostgreSQL│
                │ Database │
                └──────────┘
```

**Servicios Externos:**
```
┌──────────────────────────┐
│   Hugging Face API       │
│   (Sugerencias IA)       │
└──────────────────────────┘
```

#### Colores sugeridos:
- **Frontend**: Azul claro (#E3F2FD)
- **Backend**: Verde claro (#E8F5E9)
- **Database**: Morado claro (#F3E5F5)
- **Servicios Externos**: Naranja claro (#FFF3E0)
- **Conectores**: Gris (#607D8B)

#### Flechas:
- **Sólidas**: Flujo principal de datos
- **Punteadas**: Servicios opcionales (IA)
- **Bidireccionales**: Comunicación cliente-servidor

---

## Exportar desde Draw.io:

1. **File → Export as → PNG/SVG**
2. **Guardar como**: `architecture-diagram.png`
3. **Agregar al README**: 
   ```markdown
   ![Arquitectura](./architecture-diagram.png)
   ```

---

## Diagrama Simplificado (ASCII)

```
┌─────────────┐
│   USUARIO   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────┐
│    REACT FRONTEND           │
│  ┌─────────────────────┐   │
│  │  Protected Routes   │   │
│  └─────────┬───────────┘   │
│            │                │
│  ┌─────────▼───────────┐   │
│  │   Dashboards        │   │
│  │ • Cliente           │   │
│  │ • Soporte           │   │
│  │ • Admin             │   │
│  └─────────┬───────────┘   │
│            │                │
│  ┌─────────▼───────────┐   │
│  │   API Client        │   │
│  │   (Axios)           │   │
│  └─────────┬───────────┘   │
└────────────┼────────────────┘
             │ HTTP/REST
             ▼
┌─────────────────────────────┐
│    BACKEND API              │
│  ┌─────────────────────┐   │
│  │  Express Server     │   │
│  │  :3000              │   │
│  └─────────┬───────────┘   │
│            │                │
│  ┌─────────▼───────────┐   │
│  │   Controllers       │   │
│  │ • Auth              │   │
│  │ • Requests          │   │
│  │ • Users             │   │
│  └─────────┬───────────┘   │
└────────────┼────────────────┘
             │
             ▼
      ┌─────────────┐
      │ PostgreSQL  │
      │  Database   │
      └─────────────┘
```

---

## Flujo de Datos Detallado

### 1. Autenticación
```
Login Form → API /auth/login → Validate → Set Cookie → Redirect to Dashboard
```

### 2. Protección de Rutas
```
Route Access → Check Auth → Check Role → Allow/Redirect
```

### 3. Operaciones CRUD
```
User Action → Form Submit → API Call → Database → Response → UI Update
```

### 4. Actualización de Estados
```
SUPPORT/ADMIN → Select New Status → PATCH Request → Update DB → Reload Data
```
