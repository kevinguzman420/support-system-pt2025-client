import { Inbox, CheckCircle, TrendingUp, AlertCircle, Eye } from "lucide-react";
import { DashboardLayout } from "../../components/layouts/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, subDays } from "date-fns";
import { es } from "date-fns/locale";
import { PriorityBadge } from "../PriorityBadge";
import { StatusBadge } from "../StatusBadge";
import { userStore } from "@/store/user.store";
import { useEffect, useState } from "react";
import { requestGetAllApi } from "@/api/requests.api";
import type { IRequests } from "@/types";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import { Link } from "react-router-dom";

export function DashboardSoporte() {
  const { user: currentUser } = userStore();
  const [filteredRequests, setFilteredRequests] = useState<IRequests[]>([]);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<IRequests | null>(
    null
  );
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const stats = [
    {
      title: "Solicitudes totales",
      value: filteredRequests.length,
      icon: Inbox,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Resueltas",
      value: filteredRequests.filter(
        (r) => r.status === "RESOLVED" || r.status === "CLOSED"
        // && r.updatedAt?.split("T")[0] === new Date().toISOString().split("T")[0]
      ).length,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "En Progreso",
      value: filteredRequests.filter((r) => r.status === "IN_PROGRESS").length,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Pendientes Urgentes",
      value: filteredRequests.filter(
        (r) => r.priority === "CRITICAL" && r.status === "PENDING"
      ).length,
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ];

  // Datos para el gráfico de productividad
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dateStr = format(date, "dd/MM");
    const resolved = Math.floor(Math.random() * 10) + 5; // Mock data
    return { date: dateStr, resolved };
  });

  const getAllRequests = async () => {
    const response = await requestGetAllApi();
    console.log(response);
    if (response.success) {
      setFilteredRequests(response.requests);
    } else {
      toast.error(response.message);
    }
  };

  useEffect(() => {
    getAllRequests();
  }, []);

  // Handler para cambiar el estado
  const handleStatusChange = () => {
    if (selectedRequest) {
      console.log("ID de solicitud:", selectedRequest.id);
      console.log("Estado seleccionado:", selectedStatus);
      // Aquí puedes hacer la llamada a la API para actualizar el estado
      // await updateRequestStatusApi(selectedRequest.id, selectedStatus);
      toast.success("Estado actualizado correctamente");
      setIsDetailsDialogOpen(false);
      setSelectedRequest(null);
      getAllRequests(); // Refrescar la lista
    }
  };

  return (
    <DashboardLayout
      user={currentUser!}
      title="Dashboard de Soporte"
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

        <div className=" grid grid-cols-1 grid-row-2 gap-6">
          {/* Results */}
          {filteredRequests ? (
            <Card className="lgcol-span-2">
              <CardHeader>
                <CardTitle>
                  {filteredRequests.length}{" "}
                  {filteredRequests.length === 1 ? "Solicitud" : "Solicitudes"}
                </CardTitle>
                <CardDescription>
                  {/* {statusFilter !== "todos" && `Filtrado por: ${statusFilter}`}
                  {searchQuery && ` | Búsqueda: "${searchQuery}"`} */}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredRequests.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Título</TableHead>
                          <TableHead>Categoría</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Prioridad</TableHead>
                          <TableHead>Creación</TableHead>
                          <TableHead>Actualización</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRequests.map((request: IRequests) => (
                          <TableRow key={request.id}>
                            <TableCell className="font-mono text-sm">
                              {request.id}
                            </TableCell>
                            <TableCell className="text-sm">
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {request.user?.name || "Desconocido"}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {request.user?.email || "N/A"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="max-w-xs">
                              <div className="truncate">{request.title}</div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {/* {getCategoryLabel(ticket.category || "")} */}
                                {request.category}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <StatusBadge
                                status={request.status || "PENDING"}
                              />
                            </TableCell>
                            <TableCell>
                              <PriorityBadge
                                priority={request.priority || "LOW"}
                              />
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {format(
                                new Date(request.createdAt || Date.now()),
                                "d MMM yy",
                                {
                                  locale: es,
                                }
                              )}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {format(
                                new Date(request.updatedAt || Date.now()),
                                "d MMM yy",
                                {
                                  locale: es,
                                }
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Link
                                to={
                                  currentUser?.role === "ADMIN"
                                    ? `/dashboard/admin/solicitudes/${request.id}`
                                    : `/dashboard/soporte/solicitudes/${request.id}`
                                }
                                className=" flex justify-center items-center space-x-1 bg-gray-800 hover:bg-gray-950 transition-all text-white p-1 rounded "
                              >
                                <Eye className="w-4 h-4" />
                                <span>Detalles</span>
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div>
                    <strong>No se encontraron solicitudes</strong>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="lgcol-span-2">
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-4 w-20 " />
                </CardTitle>
                <CardDescription>
                  <Skeleton className="h-3 w-48 " />
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[...Array(5)].map((_, index) => (
                    <Skeleton key={index} className="h-6 w-20" />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Productivity Chart */}
          <Card className="">
            <CardHeader>
              <CardTitle>Productividad</CardTitle>
              <CardDescription>Últimos 7 días</CardDescription>
            </CardHeader>
            <CardContent className="">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={chartData}
                  className=" flex justify-start pt-4 bg-blue-50"
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="date"
                    className="text-xs"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis className="text-xs" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="resolved"
                    fill="#2563EB"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm">
                    <span className="text-green-600">+15%</span> vs semana
                    anterior
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alert Dialog para Eliminar */}
        {/* <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Se eliminará permanentemente
                la solicitud
                {selectedRequest && (
                  <span className="font-semibold"> #{selectedRequest.id}</span>
                )}
                .
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700"
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog> */}

        {/* Dialog para Ver Detalles y Cambiar Estado */}
        <Dialog
          open={isDetailsDialogOpen}
          onOpenChange={setIsDetailsDialogOpen}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Detalles de la Solicitud</DialogTitle>
              <DialogDescription>
                Ver información y cambiar el estado de la solicitud
              </DialogDescription>
            </DialogHeader>

            {selectedRequest && (
              <div className="space-y-4 py-4">
                {/* Información de la solicitud */}
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">ID</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedRequest.id}
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Título</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedRequest.title}
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Descripción</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedRequest.description || "Sin descripción"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Categoría</Label>
                      <p className="text-sm text-muted-foreground">
                        {selectedRequest.category}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Prioridad</Label>
                      <div className="mt-1">
                        <PriorityBadge
                          priority={selectedRequest.priority || "LOW"}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Estado Actual</Label>
                    <div className="mt-1">
                      <StatusBadge
                        status={selectedRequest.status || "PENDING"}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Label
                    htmlFor="status-select"
                    className="text-sm font-medium"
                  >
                    Cambiar Estado
                  </Label>
                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger id="status-select" className="mt-2">
                      <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pendiente</SelectItem>
                      <SelectItem value="IN_PROGRESS">En Progreso</SelectItem>
                      <SelectItem value="RESOLVED">Resuelto</SelectItem>
                      <SelectItem value="CLOSED">Cerrado</SelectItem>
                      <SelectItem value="CANCELLED">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsDetailsDialogOpen(false);
                  setSelectedRequest(null);
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleStatusChange}>Actualizar Estado</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
