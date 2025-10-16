import { Button } from "./ui/button";
import { FileQuestion } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-muted-foreground mb-4">
        {icon || <FileQuestion className="w-16 h-16" />}
      </div>
      <h3 className="mb-2 text-center">{title}</h3>
      <p className="text-muted-foreground text-center mb-6 max-w-md">
        {description}
      </p>
      {action && <Button onClick={action.onClick}>{action.label}</Button>}
    </div>
  );
}
