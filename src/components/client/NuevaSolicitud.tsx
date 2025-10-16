import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
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
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { requestCreateApi } from "@/api/requests.api";
import { userStore } from "@/store/user.store";

const requestSchema = z.object({
  title: z.string().min(5, { message: "El título es requerido" }).max(100),
  description: z
    .string()
    .min(10, { message: "La descripción es requerida" })
    .max(1000, { message: "Máximo 1000 caracteres" }),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  category: z.string().min(1, { message: "La categoría es requerida" }),
});

export type TRequestForm = z.infer<typeof requestSchema>;

export function NuevaSolicitud() {
  const { user: currentUser } = userStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const categories = [
    { value: "TECHNICAL_SUPPORT", label: "Soporte Técnico" },
    { value: "GENERAL_INQUIRY", label: "Consulta General" },
    { value: "ACCESS_ISSUE", label: "Problema de Acceso" },
    { value: "BILLING", label: "Facturación" },
    { value: "OTHER", label: "Otro" },
  ];

  const form = useForm<TRequestForm>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "LOW",
      category: "",
    },
  });

  const priorities = [
    { value: "LOW", label: "🟢 Baja", description: "No es urgente" },
    {
      value: "MEDIUM",
      label: "🟡 Media",
      description: "Requiere atención pronta",
    },
    { value: "HIGH", label: "🟠 Alta", description: "Importante y urgente" },
    {
      value: "CRITICAL",
      label: "🔴 Crítica",
      description: "Crítico, requiere atención inmediata",
    },
  ];

  const handleSubmit = async (values: TRequestForm) => {
    setLoading(true);
    const response = await requestCreateApi(values);
    if (response.success) {
      setShowSuccess(true);
      form.reset();
    }
    setLoading(false);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate("/dashboard/cliente/mis-solicitudes");
  };

  return (
    <DashboardLayout
      user={currentUser!}
      title="Nueva Solicitud"
      breadcrumbs={[
        { label: "Dashboard", path: "/dashboard/cliente" },
        { label: "Nueva Solicitud" },
      ]}
    >
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Crear Nueva Solicitud</CardTitle>
            <CardDescription>
              Completa el formulario para que nuestro equipo pueda ayudarte de
              la mejor manera
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
              >
                {/* Título */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Describe brevemente tu problema o consulta"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Categoría */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una categoría" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          You can manage email addresses in your{" "}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Prioridad */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prioridad</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una prioridad" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {priorities.map((priority) => (
                              <SelectItem
                                key={priority.value}
                                value={priority.value}
                              >
                                <div className="flex flex-col">
                                  <span>{priority.label}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {priority.description}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Selecciona el nivel de prioridad para tu solicitud
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe tu problema o consulta con el mayor detalle posible..."
                            rows={6}
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Botones */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    {loading ? "Creando solicitud..." : "Crear Solicitud"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/dashboard/cliente")}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent>
          <DialogHeader>
            <div className="mx-auto mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <DialogTitle className="text-center">
              ¡Solicitud Creada Exitosamente!
            </DialogTitle>
            <DialogDescription className="text-center">
              Tu solicitud ha sido creada. Nuestro equipo la revisará pronto.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleSuccessClose}
              className="flex-1"
            >
              Ver mis solicitudes
            </Button>
            <Button
              onClick={() => {
                setShowSuccess(false);
                window.location.reload();
              }}
              className="flex-1"
            >
              Crear otra
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
