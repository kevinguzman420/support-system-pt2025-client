import { Link } from "react-router-dom";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  ArrowRight,
} from "lucide-react";
import { DashboardLayout } from "../../components/layouts/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { StatusBadge } from "../../components/StatusBadge";
import { PriorityBadge } from "../../components/PriorityBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { mockTickets } from "../../lib/mock-data";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useEffect, useState } from "react";
import { userStore } from "@/store/user.store";

export function DashboardCliente() {
  //   const myTickets = mockTickets.filter((t) => t.clientId === currentUser.id);
  const { user: currentUser } = userStore();

  const [myTickets, setMyTickets] = useState<typeof mockTickets | null>(null);
  const recentTickets = myTickets?.slice(0, 5) || [];

  const stats = {
    total: myTickets?.length,
    pendientes: myTickets?.filter((t) => t.status === "PENDING").length,
    enProceso: myTickets?.filter((t) => t.status === "IN_PROGRESS").length,
    resueltos: myTickets?.filter(
      (t) => t.status === "RESOLVED" || t.status === "CLOSED"
    ).length,
  };

  const statCards = [
    {
      title: "Total de Solicitudes",
      value: stats.total,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Pendientes",
      value: stats.pendientes,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "En Proceso",
      value: stats.enProceso,
      icon: AlertCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Resueltas",
      value: stats.resueltos,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ];

  return (
    <DashboardLayout
      user={currentUser!}
      title="Dashboard"
      breadcrumbs={[{ label: "Dashboard" }]}
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {stat.title}
                    </p>
                    <p className="text-3xl">{stat.value}</p>
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

        {/* Quick Actions */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="mb-1">¿Necesitas ayuda?</h3>
                <p className="text-sm text-muted-foreground">
                  Crea una nueva solicitud de soporte y nuestro equipo te
                  ayudará
                </p>
              </div>
              <Button asChild>
                <Link to="/dashboard/cliente/nueva-solicitud">
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Solicitud
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Tickets */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Mis Últimas Solicitudes</CardTitle>
                <CardDescription>
                  Últimas {recentTickets.length} solicitudes creadas
                </CardDescription>
              </div>
              <Button variant="ghost" asChild>
                <Link to="/dashboard/cliente/mis-solicitudes">
                  Ver todas
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentTickets.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Prioridad</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-mono text-sm">
                          {ticket.id}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {ticket.title}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={ticket.status} />
                        </TableCell>
                        <TableCell>
                          <PriorityBadge priority={ticket.priority} />
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(
                            new Date(ticket.createdAt),
                            "d 'de' MMM, yyyy",
                            { locale: es }
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link
                              to={`/dashboard/cliente/mis-solicitudes/${ticket.id}`}
                            >
                              Ver detalles
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="mb-2">No tienes solicitudes aún</h3>
                <p className="text-muted-foreground mb-4">
                  Crea tu primera solicitud de soporte
                </p>
                <Button asChild>
                  <Link to="/dashboard/cliente/nueva-solicitud">
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Solicitud
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
