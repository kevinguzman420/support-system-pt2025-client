// Mock data para el sistema de soporte

export const RequestCategory = {
  TECHNICAL_SUPPORT: "Soporte Técnico",
  GENERAL_INQUIRY: "Consulta General",
  ACCESS_ISSUE: "Problema de Acceso",
  BILLING: "Facturación",
  OTHER: "Otro",
} as const;

export type RequestCategory =
  (typeof RequestCategory)[keyof typeof RequestCategory];

export type UserRole = "CLIENT" | "SUPPORT" | "ADMIN";

export type TicketStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED"
  | "CANCELLED";

export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type TicketCategory =
  | "SUPPORT_TECHNICAL"
  | "GENERAL_INQUIRY"
  | "ACCESS_ISSUE"
  | "BILLING"
  | "OTHER";

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  active?: boolean;
  createdAt?: string;
  requestsCount?: number;
}

export interface TicketResponse {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  content: string;
  createdAt: string;
  isAI?: boolean;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  clientId: string;
  clientName: string;
  assignedToId?: string;
  assignedToName?: string;
  createdAt: string;
  updatedAt: string;
  responses?: TicketResponse[];
  attachments?: string[];
}

// Usuarios mock
export const mockUsers: IUser[] = [
  {
    id: "1",
    name: "Juan Pérez",
    email: "juan.perez@example.com",
    role: "CLIENT",
    active: true,
    createdAt: "2025-01-10T10:00:00Z",
  },
  {
    id: "2",
    name: "María García",
    email: "maria.garcia@example.com",
    role: "CLIENT",
    active: true,
    createdAt: "2025-01-12T14:30:00Z",
  },
  {
    id: "3",
    name: "Carlos Rodríguez",
    email: "carlos.rodriguez@support.com",
    role: "SUPPORT",
    active: true,
    createdAt: "2024-12-01T09:00:00Z",
  },
  {
    id: "4",
    name: "Ana Martínez",
    email: "ana.martinez@support.com",
    role: "SUPPORT",
    active: true,
    createdAt: "2024-12-05T11:00:00Z",
  },
  {
    id: "5",
    name: "Admin Principal",
    email: "admin@system.com",
    role: "ADMIN",
    active: true,
    createdAt: "2024-11-01T08:00:00Z",
  },
];

// Tickets mock
export const mockTickets: Ticket[] = [
  {
    id: "TKT-001",
    title: "No puedo acceder a mi cuenta",
    description:
      "He intentado iniciar sesión varias veces pero me dice que mi contraseña es incorrecta. Ya hice el proceso de recuperación pero sigue sin funcionar.",
    category: "ACCESS_ISSUE",
    priority: "HIGH",
    status: "IN_PROGRESS",
    clientId: "1",
    clientName: "Juan Pérez",
    assignedToId: "3",
    assignedToName: "Carlos Rodríguez",
    createdAt: "2025-10-14T09:30:00Z",
    updatedAt: "2025-10-15T11:20:00Z",
    responses: [
      {
        id: "RSP-001",
        ticketId: "TKT-001",
        userId: "3",
        userName: "Carlos Rodríguez",
        userRole: "SUPPORT",
        content:
          "Hola Juan, he revisado tu cuenta y veo que está bloqueada por múltiples intentos fallidos. Voy a desbloquerarla ahora mismo. Por favor intenta nuevamente en 5 minutos.",
        createdAt: "2025-10-15T10:00:00Z",
      },
    ],
  },
  {
    id: "TKT-002",
    title: "Consulta sobre facturación mensual",
    description:
      "¿Podrían explicarme los cargos adicionales en mi factura de este mes? Veo un cargo que no reconozco.",
    category: "BILLING",
    priority: "MEDIUM",
    status: "RESOLVED",
    clientId: "2",
    clientName: "María García",
    assignedToId: "4",
    assignedToName: "Ana Martínez",
    createdAt: "2025-10-13T14:00:00Z",
    updatedAt: "2025-10-14T16:30:00Z",
    responses: [
      {
        id: "RSP-002",
        ticketId: "TKT-002",
        userId: "4",
        userName: "Ana Martínez",
        userRole: "SUPPORT",
        content:
          "Hola María, el cargo adicional corresponde al aumento de almacenamiento que solicitaste el día 5 de octubre. Te enviaré un desglose detallado a tu email.",
        createdAt: "2025-10-14T15:00:00Z",
      },
      {
        id: "RSP-003",
        ticketId: "TKT-002",
        userId: "2",
        userName: "María García",
        userRole: "CLIENT",
        content:
          "Perfecto, muchas gracias por la aclaración. Ya me llegó el desglose.",
        createdAt: "2025-10-14T16:30:00Z",
      },
    ],
  },
  {
    id: "TKT-003",
    title: "Error al cargar documentos",
    description:
      "Cuando intento subir archivos PDF mayores a 10MB el sistema me da error. ¿Cuál es el límite de tamaño?",
    category: "SUPPORT_TECHNICAL",
    priority: "LOW",
    status: "PENDING",
    clientId: "1",
    clientName: "Juan Pérez",
    createdAt: "2025-10-15T08:00:00Z",
    updatedAt: "2025-10-15T08:00:00Z",
  },
];

// Usuario actual simulado (cambiar según el rol que se quiera probar)
export let currentUser: IUser = mockUsers[0]; // Por defecto, cliente

export const setCurrentUser = (user: IUser) => {
  currentUser = user;
};

// Helpers
export const getCategoryLabel = (category: TicketCategory): string => {
  const labels: Record<TicketCategory, string> = {
    SUPPORT_TECHNICAL: "Soporte Técnico",
    GENERAL_INQUIRY: "Consulta General",
    ACCESS_ISSUE: "Problema de Acceso",
    BILLING: "Facturación",
    OTHER: "Otro",
  };
  return labels[category];
};

export const getStatusLabel = (status: TicketStatus): string => {
  const labels: Record<TicketStatus, string> = {
    PENDING: "Pendiente",
    IN_PROGRESS: "En Proceso",
    RESOLVED: "Resuelto",
    CLOSED: "Cerrado",
    CANCELLED: "Cancelado",
  };
  return labels[status];
};

export const getPriorityLabel = (priority: TicketPriority): string => {
  const labels: Record<TicketPriority, string> = {
    LOW: "Baja",
    MEDIUM: "Media",
    HIGH: "Alta",
    URGENT: "Urgente",
  };
  return labels[priority];
};

export const getRoleLabel = (role: UserRole): string => {
  const labels: Record<UserRole, string> = {
    CLIENT: "Cliente",
    SUPPORT: "Soporte",
    ADMIN: "Administrador",
  };
  return labels[role];
};
