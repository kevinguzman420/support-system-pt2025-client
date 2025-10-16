import {
  Download,
  Calendar,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { mockTickets, mockUsers } from "../../lib/mock-data";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { subDays, format } from "date-fns";
import { es } from "date-fns/locale";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { userStore } from "@/store/user.store";

export function Reportes() {
  const { user: currentUser } = userStore();
  // Métricas generales
  const totalTickets = mockTickets.length;
  const resolvedTickets = mockTickets.filter(
    (t) => t.status === "RESOLVED" || t.status === "CLOSED"
  ).length;
  const resolutionRate = Math.round((resolvedTickets / totalTickets) * 100);
  const avgResolutionTime = "1.8 días";

  // Datos para gráficos
  const monthlyTrend = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    return {
      fecha: format(date, "dd MMM", { locale: es }),
      creadas: Math.floor(Math.random() * 10) + 2,
      resueltas: Math.floor(Math.random() * 8) + 1,
    };
  });

  const categoryBreakdown = [
    {
      categoria: "Soporte Técnico",
      cantidad: mockTickets.filter((t) => t.category === "SUPPORT_TECHNICAL")
        .length,
    },
    {
      categoria: "Consulta General",
      cantidad: mockTickets.filter((t) => t.category === "GENERAL_INQUIRY")
        .length,
    },
    {
      categoria: "Problema Acceso",
      cantidad: mockTickets.filter((t) => t.category === "ACCESS_ISSUE").length,
    },
    {
      categoria: "Facturación",
      cantidad: mockTickets.filter((t) => t.category === "BILLING").length,
    },
    {
      categoria: "Otro",
      cantidad: mockTickets.filter((t) => t.category === "OTHER").length,
    },
  ];

  const supportTeamPerformance = [
    {
      nombre: "Carlos Rodríguez",
      resueltas: 23,
      promedio: "2.1h",
      satisfaccion: "98%",
    },
    {
      nombre: "Ana Martínez",
      resueltas: 19,
      promedio: "2.5h",
      satisfaccion: "96%",
    },
  ];

  const resolutionTimeData = [
    { rango: "< 1 hora", cantidad: 8 },
    { rango: "1-4 horas", cantidad: 15 },
    { rango: "4-12 horas", cantidad: 12 },
    { rango: "12-24 horas", cantidad: 7 },
    { rango: "> 24 horas", cantidad: 3 },
  ];

  return (
    <DashboardLayout
      user={currentUser!}
      title="Reportes y Estadísticas"
      breadcrumbs={[
        { label: "Dashboard", path: "/dashboard/admin" },
        { label: "Reportes" },
      ]}
    >
      <div className="space-y-6">
        {/* Date Range Selector */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  Hoy
                </Button>
                <Button variant="outline" size="sm">
                  Esta Semana
                </Button>
                <Button variant="outline" size="sm">
                  Este Mes
                </Button>
                <Button variant="default" size="sm">
                  Últimos 30 días
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Personalizado
                </Button>
              </div>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Exportar Reporte
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Solicitudes
                  </p>
                  <p className="text-3xl">{totalTickets}</p>
                  <p className="text-xs text-green-600 mt-1">
                    +12% vs período anterior
                  </p>
                </div>
                <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Tasa de Resolución
                  </p>
                  <p className="text-3xl">{resolutionRate}%</p>
                  <p className="text-xs text-green-600 mt-1">
                    +5% vs período anterior
                  </p>
                </div>
                <div className="bg-green-100 text-green-600 p-3 rounded-lg">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Tiempo Promedio
                  </p>
                  <p className="text-3xl">{avgResolutionTime}</p>
                  <p className="text-xs text-green-600 mt-1">
                    -0.3d vs período anterior
                  </p>
                </div>
                <div className="bg-orange-100 text-orange-600 p-3 rounded-lg">
                  <Clock className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Clientes Activos
                  </p>
                  <p className="text-3xl">
                    {mockUsers.filter((u) => u.role === "CLIENT").length}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    +3 nuevos este mes
                  </p>
                </div>
                <div className="bg-purple-100 text-purple-600 p-3 rounded-lg">
                  <Users className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Tendencia Mensual</CardTitle>
            <CardDescription>
              Solicitudes creadas vs resueltas (últimos 30 días)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={monthlyTrend}>
                <defs>
                  <linearGradient id="colorCreadas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="colorResueltas"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="fecha" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="creadas"
                  stroke="#2563EB"
                  fillOpacity={1}
                  fill="url(#colorCreadas)"
                  name="Creadas"
                />
                <Area
                  type="monotone"
                  dataKey="resueltas"
                  stroke="#10B981"
                  fillOpacity={1}
                  fill="url(#colorResueltas)"
                  name="Resueltas"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Solicitudes por Categoría</CardTitle>
              <CardDescription>Distribución de temas</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryBreakdown} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis
                    dataKey="categoria"
                    type="category"
                    tick={{ fontSize: 11 }}
                    width={120}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="cantidad"
                    fill="#2563EB"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Resolution Time Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Tiempo de Resolución</CardTitle>
              <CardDescription>Distribución por rangos</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={resolutionTimeData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis dataKey="rango" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="cantidad"
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Support Team Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Performance del Equipo de Soporte</CardTitle>
            <CardDescription>
              Métricas de rendimiento individual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agente</TableHead>
                  <TableHead>Solicitudes Resueltas</TableHead>
                  <TableHead>Tiempo Promedio</TableHead>
                  <TableHead>Satisfacción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {supportTeamPerformance.map((agent, index) => (
                  <TableRow key={index}>
                    <TableCell>{agent.nombre}</TableCell>
                    <TableCell>{agent.resueltas}</TableCell>
                    <TableCell>{agent.promedio}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-muted h-2 rounded-full overflow-hidden max-w-[100px]">
                          <div
                            className="h-full bg-green-500"
                            style={{ width: agent.satisfaccion }}
                          />
                        </div>
                        <span className="text-sm">{agent.satisfaccion}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
