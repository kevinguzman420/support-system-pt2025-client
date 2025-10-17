import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Plus,
  FileText,
  User,
  Users,
  BarChart3,
  Menu,
  X,
  Bell,
  LogOut,
  HeadphonesIcon,
  ChevronRight,
} from "lucide-react";
import { Button } from "../ui/button";
import { UserAvatar } from "../UserAvatar";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import type { UserRole, IUser } from "../../lib/mock-data";
import { logoutApi } from "@/api/logout.api";
import { userStore } from "@/store/user.store";

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  badge?: number;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: IUser;
  title: string;
  breadcrumbs?: { label: string; path?: string }[];
}

export function DashboardLayout({
  children,
  user,
  title,
  breadcrumbs,
}: DashboardLayoutProps) {
  const { clearUser } = userStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    const response = await logoutApi();
    if (response.success) {
      clearUser();
      localStorage.removeItem("token");
    }
    navigate("/login");
  };

  const getMenuItems = (role: UserRole): MenuItem[] => {
    switch (role) {
      case "CLIENT":
        return [
          {
            icon: <LayoutDashboard className="w-5 h-5" />,
            label: "Dashboard",
            path: "/dashboard/cliente",
          },
          {
            icon: <Plus className="w-5 h-5" />,
            label: "Nueva Solicitud",
            path: "/dashboard/cliente/nueva-solicitud",
          },
          {
            icon: <FileText className="w-5 h-5" />,
            label: "Mis Solicitudes",
            path: "/dashboard/cliente/mis-solicitudes",
          },
          {
            icon: <User className="w-5 h-5" />,
            label: "Mi Perfil",
            path: "/dashboard/cliente/perfil",
          },
        ];
      case "SUPPORT":
        return [
          {
            icon: <LayoutDashboard className="w-5 h-5" />,
            label: "Dashboard",
            path: "/dashboard/soporte",
          },
          // {
          //   icon: <Inbox className="w-5 h-5" />,
          //   label: "Mis Asignadas",
          //   path: "/dashboard/soporte/mis-asignadas",
          //   badge: 7,
          // },
          {
            icon: <FileText className="w-5 h-5" />,
            label: "Todas las Solicitudes",
            path: "/dashboard/soporte/todas",
          },
          {
            icon: <User className="w-5 h-5" />,
            label: "Mi Perfil",
            path: "/dashboard/soporte/perfil",
          },
        ];
      case "ADMIN":
        return [
          {
            icon: <LayoutDashboard className="w-5 h-5" />,
            label: "Dashboard",
            path: "/dashboard/admin",
          },
          {
            icon: <FileText className="w-5 h-5" />,
            label: "Todas las Solicitudes",
            path: "/dashboard/admin/solicitudes",
          },
          {
            icon: <Users className="w-5 h-5" />,
            label: "Usuarios",
            path: "/dashboard/admin/usuarios",
          },
          {
            icon: <BarChart3 className="w-5 h-5" />,
            label: "Reportes",
            path: "/dashboard/admin/reportes",
          },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems(user?.role);

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <Link
          to={`/dashboard/${user?.role}`}
          className="flex items-center gap-2"
        >
          <div className="bg-primary text-primary-foreground p-2 rounded-lg">
            <HeadphonesIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="tracking-tight">SoporteApp</h2>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isActivePath(item.path)
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50"
            }`}
            onClick={() => setSidebarOpen(false)}
          >
            {item.icon}
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <Badge variant="secondary" className="ml-auto">
                {item.badge}
              </Badge>
            )}
          </Link>
        ))}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-sidebar-accent transition-colors">
              <UserAvatar name={user?.name} />
              <div className="flex-1 text-left">
                <p className="text-sm">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
              <div>
                <h1 className="mb-1">{title}</h1>
                {breadcrumbs && breadcrumbs.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {breadcrumbs.map((crumb, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {crumb.path ? (
                          <Link
                            to={crumb.path}
                            className="hover:text-foreground"
                          >
                            {crumb.label}
                          </Link>
                        ) : (
                          <span>{crumb.label}</span>
                        )}
                        {index < breadcrumbs.length - 1 && (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                      <UserAvatar name={user?.name} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
