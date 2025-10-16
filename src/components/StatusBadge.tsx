import { Badge } from "./ui/badge";
import type { TicketStatus } from "../lib/mock-data";

interface StatusBadgeProps {
  status: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "CLOSED" | "CANCELLED";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variants: Record<TicketStatus, { label: string; className: string }> = {
    PENDING: {
      label: "Pendiente",
      className: "bg-yellow-100 text-yellow-800 border-yellow-300",
    },
    IN_PROGRESS: {
      label: "En Proceso",
      className: "bg-blue-100 text-blue-800 border-blue-300",
    },
    RESOLVED: {
      label: "Resuelto",
      className: "bg-green-100 text-green-800 border-green-300",
    },
    CLOSED: {
      label: "Cerrado",
      className: "bg-gray-100 text-gray-800 border-gray-300",
    },
    CANCELLED: {
      label: "Cancelado",
      className: "bg-red-100 text-red-800 border-red-300",
    },
  };

  const variant = variants[status];

  return (
    <Badge variant="outline" className={variant?.className}>
      {variant?.label}
    </Badge>
  );
}
