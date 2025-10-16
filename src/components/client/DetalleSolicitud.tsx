import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Send, Clock } from "lucide-react";
import { DashboardLayout } from "../../components/layouts/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { StatusBadge } from "../../components/StatusBadge";
import { PriorityBadge } from "../../components/PriorityBadge";
import { UserAvatar } from "../../components/UserAvatar";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { getCategoryLabel, getRoleLabel } from "../../lib/mock-data";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { userStore } from "@/store/user.store";
import type { IRequests } from "@/types";
import { requestGetOneApi } from "@/api/requests.api";

export function DetalleSolicitud() {
  const { user: currentUser } = userStore();
  const { id } = useParams();
  const navigate = useNavigate();
  const [responseText, setResponseText] = useState("");
  const [sending, setSending] = useState(false);
  const [request, setRequest] = useState<IRequests | null>(null);

  const getRequestById = async (id: string) => {
    const response = await requestGetOneApi(id);
    setRequest(response.request);
  };
  useEffect(() => {
    if (id) {
      getRequestById(id);
    } else {
      toast.error("ID de solicitud no proporcionado");
      navigate("/dashboard/cliente/mis-solicitudes");
    }
  }, []);

  if (!request) {
    return (
      <DashboardLayout
        user={currentUser!}
        title="Solicitud no encontrada"
        breadcrumbs={[]}
      >
        <Card>
          <CardContent className="p-12 text-center">
            <h3 className="mb-2">Solicitud no encontrada</h3>
            <p className="text-muted-foreground mb-4">
              La solicitud que buscas no existe o no tienes permiso para verla.
            </p>
            <Button asChild>
              <Link to="/dashboard/cliente/mis-solicitudes">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a mis solicitudes
              </Link>
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  const handleSendResponse = async () => {
    if (!responseText.trim()) return;

    setSending(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Respuesta enviada correctamente");
    setResponseText("");
    setSending(false);
  };

  const responses = request.responses || [];

  return (
    <DashboardLayout
      user={currentUser!}
      title={`Solicitud ${request.id}`}
      breadcrumbs={[
        { label: "Dashboard", path: "/dashboard/cliente" },
        {
          label: "Mis Solicitudes",
          path: "/dashboard/cliente/mis-solicitudes",
        },
        { label: request.id! },
      ]}
    >
      <div className="mb-4">
        <Button variant="ghost" asChild>
          <Link to="/dashboard/cliente/mis-solicitudes">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a mis solicitudes
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Info */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="mb-2">{request.title}</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge status={request.status} />
                    <PriorityBadge priority={request.priority} />
                    <Badge variant="outline">
                      {getCategoryLabel(
                        request.category || ("SUPPORT_TECHNICAL" as any)
                      )}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="mb-2">Descripción</h4>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {request.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Responses Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Historial de Respuestas</CardTitle>
            </CardHeader>
            <CardContent>
              {responses.length > 0 ? (
                <div className="space-y-6">
                  {responses.map((response, index) => (
                    <div key={response.id}>
                      <div className="flex gap-4">
                        <UserAvatar
                          name={currentUser?.name!}
                          className="flex-shrink-0"
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <span>{currentUser?.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {getRoleLabel(currentUser?.role || "CLIENT")}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {formatDistanceToNow(
                                new Date(response?.createdAt || new Date()),
                                {
                                  addSuffix: true,
                                  locale: es,
                                }
                              )}
                            </span>
                          </div>
                          <div className="bg-muted p-4 rounded-lg">
                            <p className="whitespace-pre-wrap">
                              {response.content}
                            </p>
                          </div>
                        </div>
                      </div>
                      {index < responses.length - 1 && (
                        <Separator className="my-6" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Aún no hay respuestas para esta solicitud</p>
                  <p className="text-sm mt-1">
                    Nuestro equipo la revisará pronto
                  </p>
                </div>
              )}

              {/* Reply Form */}
              {request.status !== "CLOSED" &&
                request.status !== "CANCELLED" && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="mb-3">Agregar respuesta</h4>
                    <div className="space-y-3">
                      <Textarea
                        placeholder="Escribe tu mensaje aquí..."
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        rows={4}
                        className="resize-none"
                      />
                      <div className="flex justify-end">
                        <Button
                          onClick={handleSendResponse}
                          disabled={!responseText.trim() || sending}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          {sending ? "Enviando..." : "Enviar Respuesta"}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Detalles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  ID de Solicitud
                </p>
                <p className="font-mono">{request.id}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Estado</p>
                <StatusBadge status={request.status} />
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Prioridad</p>
                <PriorityBadge priority={request.priority} />
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Categoría</p>
                <p>
                  {getCategoryLabel(
                    request?.category || ("SUPPORT_TECHNICAL" as any)
                  )}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Fecha de Creación
                </p>
                <p>
                  {format(
                    new Date(request.createdAt || new Date()),
                    "d 'de' MMMM 'de' yyyy, HH:mm",
                    { locale: es }
                  )}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Última Actualización
                </p>
                <p>
                  {format(
                    new Date(request.updatedAt || new Date()),
                    "d 'de' MMMM 'de' yyyy, HH:mm",
                    { locale: es }
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Status History Card */}
          <Card>
            <CardHeader>
              <CardTitle>Historial de Estados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <div className="w-px h-full bg-border" />
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <StatusBadge status={request.status} />
                      <Clock className="w-3 h-3 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(
                        new Date(request.updatedAt || new Date()),
                        {
                          addSuffix: true,
                          locale: es,
                        }
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-1">
                      <Badge variant="outline">Creada</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {format(
                        new Date(request.createdAt || new Date()),
                        "d MMM yyyy, HH:mm",
                        {
                          locale: es,
                        }
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
