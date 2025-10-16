import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, HeadphonesIcon } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { AuthLayout } from "./layouts/AutoLayout";
// import { mockUsers, setCurrentUser } from "../lib/mock-data";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { axiosInstance } from "@/axios.config";
import { userStore } from "@/store/user.store";

const loginSchema = z.object({
  email: z.string().min(1, { message: "El email es requerido" }).max(50),
  password: z
    .string()
    .min(1, { message: "La contraseña debe tener al menos 6 caracteres" })
    .max(100),
});

type TLoginForm = z.infer<typeof loginSchema>;

interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: "ADMIN" | "SUPPORT" | "CLIENT";
  };
}

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  //   const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = userStore();
  //   const navigate = useNavigate();

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: TLoginForm) => {
    setLoading(true);
    // setError(null);

    try {
      const response = await axiosInstance.post<LoginResponse>("/auth/login", {
        email: data.email,
        password: data.password,
      });

      console.log(response)

      localStorage.setItem("token", response.data.token);

      setUser({
        ...response.data.user,
      });

      // ✅ Redirigir según el rol
      const { role } = response.data.user;
      if (role === "ADMIN") {
        navigate("/dashboard/admin");
      } else if (role === "SUPPORT") {
        navigate("/dashboard/soporte");
      } else {
        navigate("/dashboard/cliente");
      }

      console.log("Login exitoso:", response.data);
    } catch (error: any) {
      console.error("Error during login:", error);

      // ✅ Manejo de errores específicos
      if (error.response) {
        // El servidor respondió con un status code fuera del rango 2xx
        const message = error.response.data?.message || "Error en el login";
        setError(message);

        switch (error.response.status) {
          case 401:
            setError("Credenciales inválidas");
            break;
          case 400:
            setError("Email y contraseña son requeridos");
            break;
          case 500:
            setError("Error en el servidor. Intenta más tarde");
            break;
          default:
            setError(message);
        }
      } else if (error.request) {
        // La petición se hizo pero no se recibió respuesta
        setError("No se pudo conectar con el servidor. Verifica tu conexión");
      } else {
        // Algo pasó al configurar la petición
        setError("Error inesperado. Intenta de nuevo");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <AuthLayout>
      <div className="mb-8 text-center lg:hidden">
        <figure>
          <img
            src="/cifra-logo.png"
            alt="Logo"
            className="mx-auto mb-4 w-20 h-20"
          />
        </figure>
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="bg-primary text-primary-foreground p-2 rounded-lg">
            <HeadphonesIcon className="w-6 h-6" />
          </div>
          <h1>Sistema de Soporte</h1>
        </div>
      </div>

      <Card>
        <CardHeader className="space-y-1">
          <figure>
            <img
              src="/images/cifra-logo.png"
              alt="Logo"
              className="w-[150px] h-auto mb-4"
            />
          </figure>
          <CardTitle>Iniciar Sesión</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder al sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            type="email"
                            placeholder="tu@email.com"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-10 pr-10"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-2 text-muted-foreground">o</span>
                </div>
              </div>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">
                  ¿No tienes cuenta?{" "}
                </span>
                <Link to="/register" className="text-primary hover:underline">
                  Regístrate
                </Link>
              </div>
            </form>
          </Form>

          {/* Demo credentials helper */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground mb-2">
              Credenciales de prueba:
            </p>
            <div className="space-y-1 text-xs">
              <p>
                <strong>Cliente:</strong> juan.perez@example.com
              </p>
              <p>
                <strong>Soporte:</strong> carlos.rodriguez@support.com
              </p>
              <p>
                <strong>Admin:</strong> admin@system.com
              </p>
              <p className="mt-2">
                <strong>Contraseña para todos:</strong> demo123
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
