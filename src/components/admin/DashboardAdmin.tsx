import { Link } from "react-router-dom";
import { FileText, Users, TrendingUp, Clock } from "lucide-react";
import { DashboardLayout } from "../../components/layouts/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { mockTickets, mockUsers } from "../../lib/mock-data";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, subDays } from "date-fns";
import { userStore } from "@/store/user.store";
import { useEffect } from "react";
import { requestGetAllApi } from "@/api/requests.api";

export function DashboardAdmin() {
  const totalTickets = mockTickets.length;
  const resolvedTickets = mockTickets.filter(
    (t) => t.status === "RESOLVED" || t.status === "CLOSED"
  ).length;
  const resolutionRate = Math.round((resolvedTickets / totalTickets) * 100);
  const activeUsers = mockUsers.filter((u) => u.active).length;

  const { user: currentUser } = userStore();

  const stats = [
    {
      title: "Total Solicitudes",
      value: totalTickets,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      change: "+12%",
    },
    {
      title: "Tasa de Resolución",
      value: `${resolutionRate}%`,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
      change: "+5%",
    },
    {
      title: "Usuarios Activos",
      value: activeUsers,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      change: "+3",
    },
    {
      title: "Tiempo Promedio",
      value: "1.8 días",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      change: "-0.3d",
    },
  ];

  // Pie chart - Tickets por estado
  const statusData = [
    {
      name: "Pendiente",
      value: mockTickets.filter((t) => t.status === "PENDING").length,
      color: "#F59E0B",
    },
    {
      name: "En Proceso",
      value: mockTickets.filter((t) => t.status === "IN_PROGRESS").length,
      color: "#2563EB",
    },
    {
      name: "Resuelto",
      value: mockTickets.filter((t) => t.status === "RESOLVED").length,
      color: "#10B981",
    },
    {
      name: "Cerrado",
      value: mockTickets.filter((t) => t.status === "CLOSED").length,
      color: "#6B7280",
    },
  ];

  // Bar chart - Tickets por categoría
  // const categoryData = [
  //   {
  //     name: "Soporte Técnico",
  //     value: mockTickets.filter((t) => t.category === "soporte_tecnico").length,
  //   },
  //   {
  //     name: "Consultas",
  //     value: mockTickets.filter((t) => t.category === "consulta_general")
  //       .length,
  //   },
  //   {
  //     name: "Acceso",
  //     value: mockTickets.filter((t) => t.category === "problema_acceso").length,
  //   },
  //   {
  //     name: "Facturación",
  //     value: mockTickets.filter((t) => t.category === "facturacion").length,
  //   },
  //   {
  //     name: "Otro",
  //     value: mockTickets.filter((t) => t.category === "otro").length,
  //   },
  // ];

  // Line chart - Tendencia
  const trendData = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    return {
      date: format(date, "dd/MM"),
      tickets: Math.floor(Math.random() * 8) + 3,
    };
  });

  // Activity log
  const recentActivity = [
    {
      user: "Juan Pérez",
      action: "creó una nueva solicitud",
      time: "Hace 5 minutos",
    },
    {
      user: "Carlos Rodríguez",
      action: "resolvió TKT-001",
      time: "Hace 12 minutos",
    },
    {
      user: "María García",
      action: "respondió en TKT-002",
      time: "Hace 23 minutos",
    },
    { user: "Ana Martínez", action: "asignó TKT-004", time: "Hace 1 hora" },
  ];

  const getAllRequests = async () => {
    const response = await requestGetAllApi();
    console.log(response.requests);
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
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {stat.title}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl">{stat.value}</p>
                      <span className="text-sm text-green-600">
                        {stat.change}
                      </span>
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
          ))}
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
            </CardContent>
          </Card>

          {/* Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Solicitudes por Categoría</CardTitle>
              <CardDescription>Total acumulado</CardDescription>
            </CardHeader>
            <CardContent>
              {/* <ResponsiveContainer width="100%" height={250}>
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
              </ResponsiveContainer> */}
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
          </CardContent>
        </Card>

        {/* Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>Últimas acciones en el sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm">
                        <span>{activity.user}</span>{" "}
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
              <Button variant="outline" className="w-full mt-4">
                Ver todo el historial
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Accesos Rápidos</CardTitle>
              <CardDescription>Gestión del sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start">
                <Link to="/dashboard/admin/usuarios">
                  <Users className="w-4 h-4 mr-2" />
                  Gestionar Usuarios
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full justify-start"
              >
                <Link to="/dashboard/admin/solicitudes">
                  <FileText className="w-4 h-4 mr-2" />
                  Ver Todas las Solicitudes
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full justify-start"
              >
                <Link to="/dashboard/admin/reportes">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Reportes Detallados
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
