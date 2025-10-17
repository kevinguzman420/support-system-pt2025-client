import { Badge } from "./ui/badge";
import type { TicketPriority } from "../lib/mock-data";

interface PriorityBadgeProps {
  priority: TicketPriority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const variants: Record<PriorityBadgeProps["priority"], { label: string; className: string }> =
    {
      LOW: {
        label: "Baja",
        className: "bg-green-100 text-green-800 border-green-300",
      },
      MEDIUM: {
        label: "Media",
        className: "bg-yellow-100 text-yellow-800 border-yellow-300",
      },
      HIGH: {
        label: "Alta",
        className: "bg-orange-100 text-orange-800 border-orange-300",
      },
      CRITICAL: {
        label: "Urgente",
        className: "bg-red-100 text-red-800 border-red-300",
      },
    };

  const variant = variants[priority];

  return (
    <Badge variant="outline" className={variant?.className}>
      {variant?.label}
    </Badge>
  );
}
