export interface IRequests {
  id?: string;
  title: string;
  description: string;
  category?: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "CLOSED" | "CANCELLED";
  clientId?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  responses?:
    | {
        id?: string;
        content?: string;
        createdAt?: string;
      }[]
    | null;
}
