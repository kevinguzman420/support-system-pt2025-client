import { Navigate } from "react-router-dom";
import { userStore } from "@/store/user.store";
import type { UserRole } from "@/types";

interface PublicRouteProps {
  children: React.ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const { user } = userStore();

  // Si hay usuario logueado, redirigir a su dashboard
  if (user) {
    const dashboardByRole: Record<UserRole, string> = {
      CLIENT: "/dashboard/cliente",
      SUPPORT: "/dashboard/soporte",
      ADMIN: "/dashboard/admin",
    };

    return <Navigate to={dashboardByRole[user.role]} replace />;
  }

  // No hay usuario logueado, mostrar la ruta pública
  return <>{children}</>;
}
