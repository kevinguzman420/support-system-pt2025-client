import {
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
import { Badge } from "../../components/ui/badge";
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
import { subDays, format, parseISO, differenceInHours } from "date-fns";
import { es } from "date-fns/locale";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { userStore } from "@/store/user.store";
import { useEffect, useState } from "react";
import { requestGetAllApi } from "@/api/requests.api";
import type { IRequests } from "@/types";
import { Skeleton } from "../ui/skeleton";

export function Reportes() {
  const { user: currentUser } = userStore();
  const [allRequests, setAllRequests] = useState<IRequests[]>([]);
  const [loading, setLoading] = useState(true);

  const getAllRequests = async () => {
    setLoading(true);
    const response = await requestGetAllApi();
    if (response.success && response.requests) {
      setAllRequests(response.requests);
    }
    setLoading(false);
  };

  useEffect(() => {
    getAllRequests();
  }, []);

  // Métricas generales basadas en datos reales
  const totalTickets = allRequests.length;
  const resolvedTickets = allRequests.filter(
    (t) => t.status === "RESOLVED" || t.status === "CLOSED"
  ).length;
  const resolutionRate = totalTickets > 0 ? Math.round((resolvedTickets / totalTickets) * 100) : 0;
  
  // Calcular tiempo promedio de resolución
  const resolvedRequestsWithTime = allRequests.filter(
    (r) => (r.status === "RESOLVED" || r.status === "CLOSED") && r.createdAt && r.updatedAt
  );
  const avgResolutionTimeHours = resolvedRequestsWithTime.length > 0
    ? resolvedRequestsWithTime.reduce((acc, r) => {
        const hours = differenceInHours(parseISO(r.updatedAt!), parseISO(r.createdAt!));
        return acc + hours;
      }, 0) / resolvedRequestsWithTime.length
    : 0;
  const avgResolutionTime = avgResolutionTimeHours > 24 
    ? `${(avgResolutionTimeHours / 24).toFixed(1)} días`
    : `${avgResolutionTimeHours.toFixed(1)} horas`;

  // Datos para el gráfico de tendencia mensual (últimos 30 días)
  const monthlyTrend = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    const dateStr = format(date, "yyyy-MM-dd");
    
    const creadas = allRequests.filter((r) => {
      if (!r.createdAt) return false;
      const reqDate = format(parseISO(r.createdAt), "yyyy-MM-dd");
      return reqDate === dateStr;
    }).length;
    
    const resueltas = allRequests.filter((r) => {
      if (!r.updatedAt || (r.status !== "RESOLVED" && r.status !== "CLOSED")) return false;
      const reqDate = format(parseISO(r.updatedAt), "yyyy-MM-dd");
      return reqDate === dateStr;
    }).length;
    
    return {
      fecha: format(date, "dd MMM", { locale: es }),
      creadas,
      resueltas,
    };
  });

  // Desglose por categoría
  const categoryBreakdown = [
    {
      categoria: "Soporte Técnico",
      cantidad: allRequests.filter((t) => t.category === "TECHNICAL_SUPPORT").length,
    },
    {
      categoria: "Consulta General",
      cantidad: allRequests.filter((t) => t.category === "GENERAL_INQUIRY").length,
    },
    {
      categoria: "Problema Acceso",
      cantidad: allRequests.filter((t) => t.category === "ACCESS_ISSUE").length,
    },
    {
      categoria: "Facturación",
      cantidad: allRequests.filter((t) => t.category === "BILLING").length,
    },
    {
      categoria: "Otro",
      cantidad: allRequests.filter((t) => t.category === "OTHER").length,
    },
  ].filter(item => item.cantidad > 0); // Solo mostrar categorías con datos

  // Datos de tiempo de resolución
  const resolutionTimeData = [
    { 
      rango: "< 1 hora", 
      cantidad: resolvedRequestsWithTime.filter(r => {
        const hours = differenceInHours(parseISO(r.updatedAt!), parseISO(r.createdAt!));
        return hours < 1;
      }).length 
    },
    { 
      rango: "1-4 horas", 
      cantidad: resolvedRequestsWithTime.filter(r => {
        const hours = differenceInHours(parseISO(r.updatedAt!), parseISO(r.createdAt!));
        return hours >= 1 && hours < 4;
      }).length 
    },
    { 
      rango: "4-12 horas", 
      cantidad: resolvedRequestsWithTime.filter(r => {
        const hours = differenceInHours(parseISO(r.updatedAt!), parseISO(r.createdAt!));
        return hours >= 4 && hours < 12;
      }).length 
    },
    { 
      rango: "12-24 horas", 
      cantidad: resolvedRequestsWithTime.filter(r => {
        const hours = differenceInHours(parseISO(r.updatedAt!), parseISO(r.createdAt!));
        return hours >= 12 && hours < 24;
      }).length 
    },
    { 
      rango: "> 24 horas", 
      cantidad: resolvedRequestsWithTime.filter(r => {
        const hours = differenceInHours(parseISO(r.updatedAt!), parseISO(r.createdAt!));
        return hours >= 24;
      }).length 
    },
  ];

  // Top usuarios con más solicitudes
  const userRequestCounts = allRequests.reduce((acc, req) => {
    if (!req.user?.name) return acc;
    const userName = req.user.name;
    if (!acc[userName]) {
      acc[userName] = { name: userName, count: 0, email: req.user.email };
    }
    acc[userName].count++;
    return acc;
  }, {} as Record<string, { name: string; count: number; email: string }>);

  const topUsers = Object.values(userRequestCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  if (loading) {
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
          <Skeleton className="h-32 w-full" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </DashboardLayout>
    );
  }

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
                    {Object.keys(userRequestCounts).length}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Usuarios con solicitudes
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

        {/* Top Users with Most Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Usuarios con Más Solicitudes</CardTitle>
            <CardDescription>
              Top 5 usuarios que han creado más tickets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Total Solicitudes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topUsers.length > 0 ? (
                  topUsers.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{user.count}</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      No hay datos disponibles
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
