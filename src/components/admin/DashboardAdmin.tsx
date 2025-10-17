import { FileText, Users, TrendingUp, Clock } from "lucide-react";
import { DashboardLayout } from "../../components/layouts/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { mockUsers } from "../../lib/mock-data";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, subDays, differenceInDays, parseISO } from "date-fns";
import { userStore } from "@/store/user.store";
import { useEffect, useState } from "react";
import { requestGetAllApi } from "@/api/requests.api";
import type { IRequests } from "@/types";
import { Skeleton } from "../ui/skeleton";

export function DashboardAdmin() {
  const { user: currentUser } = userStore();
  const [allRequests, setAllRequests] = useState<IRequests[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Calcular estadísticas basadas en datos reales
  const totalTickets = allRequests.length;
  const resolvedTickets = allRequests.filter(
    (t) => t.status === "RESOLVED" || t.status === "CLOSED"
  ).length;
  const resolutionRate = totalTickets > 0 ? Math.round((resolvedTickets / totalTickets) * 100) : 0;
  const activeUsers = mockUsers.filter((u) => u.active).length;

  // Calcular tiempo promedio de resolución
  const resolvedRequestsWithDates = allRequests.filter(
    (r) => (r.status === "RESOLVED" || r.status === "CLOSED") && r.createdAt && r.updatedAt
  );
  
  const averageResolutionTime = resolvedRequestsWithDates.length > 0
    ? resolvedRequestsWithDates.reduce((acc, request) => {
        const created = parseISO(request.createdAt!);
        const updated = parseISO(request.updatedAt!);
        return acc + differenceInDays(updated, created);
      }, 0) / resolvedRequestsWithDates.length
    : 0;

  const stats = [
    {
      title: "Total Solicitudes",
      value: totalTickets,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Tasa de Resolución",
      value: `${resolutionRate}%`,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Usuarios Activos",
      value: activeUsers,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Tiempo Promedio",
      value: `${averageResolutionTime.toFixed(1)} días`,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  // Pie chart - Tickets por estado (datos reales)
  const statusData = [
    {
      name: "Pendiente",
      value: allRequests.filter((t) => t.status === "PENDING").length,
      color: "#F59E0B",
    },
    {
      name: "En Proceso",
      value: allRequests.filter((t) => t.status === "IN_PROGRESS").length,
      color: "#2563EB",
    },
    {
      name: "Resuelto",
      value: allRequests.filter((t) => t.status === "RESOLVED").length,
      color: "#10B981",
    },
    {
      name: "Cerrado",
      value: allRequests.filter((t) => t.status === "CLOSED").length,
      color: "#6B7280",
    },
    {
      name: "Cancelado",
      value: allRequests.filter((t) => t.status === "CANCELLED").length,
      color: "#EF4444",
    },
  ].filter(item => item.value > 0); // Solo mostrar estados con datos

  // Bar chart - Tickets por categoría (datos reales)
  const categoryLabels: Record<string, string> = {
    TECHNICAL_SUPPORT: "Soporte Técnico",
    BILLING: "Facturación",
    GENERAL_INQUIRY: "Consulta General",
    ACCOUNT_ACCESS: "Acceso a Cuenta",
    OTHER: "Otro",
  };

  const categoryData = Object.keys(categoryLabels).map(category => ({
    name: categoryLabels[category],
    value: allRequests.filter((t) => t.category === category).length,
  })).filter(item => item.value > 0); // Solo mostrar categorías con datos

  // Line chart - Tendencia (basado en datos reales)
  const trendData = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    const dateStr = format(date, "yyyy-MM-dd");
    
    // Contar solicitudes creadas en ese día
    const ticketsCreated = allRequests.filter((request) => {
      if (!request.createdAt) return false;
      const requestDate = format(parseISO(request.createdAt), "yyyy-MM-dd");
      return requestDate === dateStr;
    }).length;
    
    return {
      date: format(date, "dd/MM"),
      tickets: ticketsCreated,
    };
  });

  // Activity log basado en las solicitudes más recientes
  const recentActivity = allRequests
    .filter(r => r.createdAt) // Solo solicitudes con fecha
    .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
    .slice(0, 4)
    .map((request) => {
      const now = new Date();
      const createdDate = parseISO(request.createdAt!);
      const diffMinutes = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60));
      
      let timeText = "";
      if (diffMinutes < 1) timeText = "Ahora mismo";
      else if (diffMinutes < 60) timeText = `Hace ${diffMinutes} minuto${diffMinutes > 1 ? 's' : ''}`;
      else if (diffMinutes < 1440) {
        const hours = Math.floor(diffMinutes / 60);
        timeText = `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
      } else {
        const days = Math.floor(diffMinutes / 1440);
        timeText = `Hace ${days} día${days > 1 ? 's' : ''}`;
      }
      
      return {
        user: request.user?.name || "Usuario desconocido",
        action: `creó la solicitud "${request.title}"`,
        time: timeText,
      };
    });

  const getAllRequests = async () => {
    setIsLoading(true);
    const response = await requestGetAllApi();
    console.log(response)
    if (response.success) {
      setAllRequests(response.requests);
    }
    setIsLoading(false);
  };
  
  useEffect(() => {
    getAllRequests();
  }, []);

  return (
    <DashboardLayout
      user={currentUser!}
      title="Dashboard Administrativo"
      breadcrumbs={[{ label: "Dashboard" }]}
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            // Skeleton loading para las estadísticas
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                    <Skeleton className="h-12 w-12 rounded-lg" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {stat.title}
                      </p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-3xl">{stat.value}</p>
                      </div>
                    </div>
                    <div
                      className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}
                    >
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Solicitudes por Estado</CardTitle>
              <CardDescription>Distribución actual</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-[250px]">
                  <Skeleton className="h-40 w-40 rounded-full" />
                </div>
              ) : statusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(props: any) =>
                        `${props.name} ${(props.percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                  No hay datos disponibles
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Solicitudes por Categoría</CardTitle>
              <CardDescription>Total acumulado</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={categoryData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="value" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                  No hay datos disponibles
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Tendencia de Solicitudes</CardTitle>
            <CardDescription>Últimos 30 días</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="tickets"
                    stroke="#2563EB"
                    strokeWidth={2}
                    dot={{ fill: "#2563EB", r: 4 }}
                    name="Solicitudes"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>Últimas acciones en el sistema</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="w-2 h-2 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentActivity.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center gap-3 hover:bg-accent p-2 rounded">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">{activity.user}</span>{" "}
                            <span className="text-muted-foreground">
                              {activity.action}
                            </span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                  No hay actividad reciente
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
