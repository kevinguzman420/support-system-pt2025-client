import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Plus, Eye, Trash2 } from "lucide-react";
import { DashboardLayout } from "../../components/layouts/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Badge } from "../../components/ui/badge";
import { type TicketStatus } from "../../lib/mock-data";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { EmptyState } from "../EmptyState";
import { requestGetApi } from "@/api/requests.api";
import { Skeleton } from "../ui/skeleton";
import type { IRequests } from "@/types";
import { userStore } from "@/store/user.store";

export function MisSolicitudes() {
  const { user: currentUser } = userStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "todos">(
    "todos"
  );
  const [filteredTickets, setFilteredTickets] = useState<IRequests[] | null>(
    null
  );

  // const myTickets = mockTickets.filter((t) => t.clientId === currentUser.id);

  // const filteredTickets = myTickets.filter((ticket) => {
  //   const matchesSearch =
  //     ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     ticket.id.toLowerCase().includes(searchQuery.toLowerCase());

  //   const matchesStatus =
  //     statusFilter === "todos" || ticket.status === statusFilter;

  //   return matchesSearch && matchesStatus;
  // });

  const handleDelete = (ticketId: string) => {
    toast.success(`Solicitud ${ticketId} eliminada`);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("todos");
  };

  const getAllRequests = async () => {
    const response = await requestGetApi();
    if (response.success) {
      setFilteredTickets(response.requests);
    } else {
      toast.error(response.message);
    }
  };

  useEffect(() => {
    getAllRequests();
  }, []);

  return (
    <DashboardLayout
      user={currentUser!}
      title="Mis Solicitudes"
      breadcrumbs={[
        { label: "Dashboard", path: "/dashboard/cliente" },
        { label: "Mis Solicitudes" },
      ]}
    >
      <div className="space-y-6">
        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por título o ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as TicketStatus | "todos")
                }
              >
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="en_proceso">En Proceso</SelectItem>
                  <SelectItem value="resuelto">Resuelto</SelectItem>
                  <SelectItem value="cerrado">Cerrado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={clearFilters}>
                <Filter className="w-4 h-4 mr-2" />
                Limpiar
              </Button>
              <Button asChild>
                <Link to="/dashboard/cliente/nueva-solicitud">
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {filteredTickets ? (
          <Card>
            <CardHeader>
              <CardTitle>
                {filteredTickets.length}{" "}
                {filteredTickets.length === 1 ? "Solicitud" : "Solicitudes"}
              </CardTitle>
              <CardDescription>
                {statusFilter !== "todos" && `Filtrado por: ${statusFilter}`}
                {searchQuery && ` | Búsqueda: "${searchQuery}"`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredTickets.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
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
                      {filteredTickets.map((request: IRequests) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-mono text-sm">
                            {request.id}
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <div className="truncate">{request.title}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {/* {getCategoryLabel(ticket.category || "")} */}
                              {request.category} hola
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={request.status || "PENDING"} />
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
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  Acciones
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link
                                    to={`/dashboard/cliente/mis-solicitudes/${request.id}`}
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    Ver detalles
                                  </Link>
                                </DropdownMenuItem>
                                {request.status === "PENDING" && (
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => handleDelete(request.id!)}
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Eliminar
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <EmptyState
                  title="No se encontraron solicitudes"
                  description={
                    searchQuery || statusFilter !== "todos"
                      ? "Intenta ajustar los filtros de búsqueda"
                      : "Aún no has creado ninguna solicitud de soporte"
                  }
                  action={
                    searchQuery || statusFilter !== "todos"
                      ? { label: "Limpiar filtros", onClick: clearFilters }
                      : {
                          label: "Crear mi primera solicitud",
                          onClick: () =>
                            (window.location.href =
                              "/dashboard/cliente/nueva-solicitud"),
                        }
                  }
                />
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
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
      </div>
    </DashboardLayout>
  );
}
