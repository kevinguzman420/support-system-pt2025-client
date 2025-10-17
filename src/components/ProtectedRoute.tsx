import { Navigate } from "react-router-dom";
import { userStore } from "@/store/user.store";
import type { UserRole } from "@/types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user } = userStore();

  // Si no hay usuario logueado, redirigir a login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si se especifican roles permitidos y el usuario no tiene uno de esos roles
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirigir al dashboard correspondiente a su rol
    const dashboardByRole: Record<UserRole, string> = {
      CLIENT: "/dashboard/cliente",
      SUPPORT: "/dashboard/soporte",
      ADMIN: "/dashboard/admin",
    };

    return <Navigate to={dashboardByRole[user.role]} replace />;
  }

  // Usuario autenticado y con el rol correcto
  return <>{children}</>;
}
