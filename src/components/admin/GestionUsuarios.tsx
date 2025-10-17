import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
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
import { Badge } from "../../components/ui/badge";
import { UserAvatar } from "../../components/UserAvatar";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Switch } from "../../components/ui/switch";
import { type UserRole, getRoleLabel } from "../../lib/mock-data";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { userStore } from "@/store/user.store";
import type { IUser } from "@/types";
import { getAllUsersApi, createUserApi, updateUserApi } from "@/api/users.api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Esquema de validación para crear usuario
const createUserSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  role: z.enum(["ADMIN", "SUPPORT", "CLIENT"]),
});

// Esquema de validación para editar usuario (password opcional)
const editUserSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").optional().or(z.literal("")),
  role: z.enum(["ADMIN", "SUPPORT", "CLIENT"]),
});

export function GestionUsuarios() {
  const { user: currentUser } = userStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "todos">("todos");
  const [allUsers, setAllUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  // Form para crear usuario
  const form = useForm<z.infer<typeof createUserSchema>>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "CLIENT",
    },
  });

  // Form para editar usuario
  const editForm = useForm<z.infer<typeof editUserSchema>>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: "",
      password: "",
      role: "CLIENT",
    },
  });

  // Filtrar usuarios basado en búsqueda y rol
  const filteredUsers = allUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "todos" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    // Cambiar al estado opuesto
    const newStatus = !currentStatus;
    
    const response = await updateUserApi(userId, { active: newStatus });
    
    if (response.success) {
      toast.success(
        `Usuario ${newStatus ? "activado" : "desactivado"} correctamente`
      );
      // Recargar la lista de usuarios para reflejar el cambio
      getAllUsers();
    } else {
      toast.error(response.message || "Error al cambiar el estado del usuario");
    }
  };

  const handleDeleteUser = (userName: string) => {
    toast.success(`Usuario ${userName} eliminado`);
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "SUPPORT":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "CLIENT":
        return "bg-green-100 text-green-800 border-green-300";
    }
  };

  const getAllUsers = async () => {
    setIsLoading(true);
    const response = await getAllUsersApi();
    console.log(response);
    if (response.success) {
      setAllUsers(response.users);
    } else {
      toast.error(response.message || "Error al cargar los usuarios");
      setAllUsers([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  // Handler para crear usuario
  const onSubmit = async (values: z.infer<typeof createUserSchema>) => {
    setIsCreating(true);

    console.log("Datos a enviar:", values);
    const response = await createUserApi(values);

    if (response.success) {
      toast.success("Usuario creado correctamente");
      form.reset();
      setIsDialogOpen(false);
      // Recargar la lista de usuarios
      getAllUsers();
    } else {
      toast.error(response.message || "Error al crear el usuario");
    }

    setIsCreating(false);
  };

  // Handler para abrir el dialog de edición
  const handleEditClick = (user: IUser) => {
    setSelectedUser(user);
    editForm.reset({
      name: user.name,
      password: "",
      role: user.role,
    });
    setIsEditDialogOpen(true);
  };

  // Handler para editar usuario
  const onEditSubmit = async (values: z.infer<typeof editUserSchema>) => {
    if (!selectedUser) return;
    
    setIsUpdating(true);

    // Preparar datos solo con los campos que se van a actualizar
    const updateData: any = {
      name: values.name,
      role: values.role,
    };

    // Solo incluir password si se proporcionó uno nuevo
    if (values.password && values.password.length > 0) {
      updateData.password = values.password;
    }

    console.log("Datos a actualizar:", updateData);
    const response = await updateUserApi(selectedUser.id, updateData);

    if (response.success) {
      toast.success("Usuario actualizado correctamente");
      editForm.reset();
      setIsEditDialogOpen(false);
      setSelectedUser(null);
      // Recargar la lista de usuarios
      getAllUsers();
    } else {
      toast.error(response.message || "Error al actualizar el usuario");
    }

    setIsUpdating(false);
  };

  return (
    <DashboardLayout
      user={currentUser!}
      title="Gestión de Usuarios"
      breadcrumbs={[
        { label: "Dashboard", path: "/dashboard/admin" },
        { label: "Usuarios" },
      ]}
    >
      <div className="space-y-6">
        {/* Filters & Actions */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre o email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select
                value={roleFilter}
                onValueChange={(value) =>
                  setRoleFilter(value as UserRole | "todos")
                }
              >
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filtrar por rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los roles</SelectItem>
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                  <SelectItem value="SUPPORT">Soporte</SelectItem>
                  <SelectItem value="CLIENT">Cliente</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Usuario
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                    <DialogDescription>
                      Completa el formulario para crear un nuevo usuario en el
                      sistema
                    </DialogDescription>
                  </DialogHeader>

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre Completo</FormLabel>
                            <FormControl>
                              <Input placeholder="Ej: Juan Pérez" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="ejemplo@correo.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contraseña</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="••••••••"
                                  className=" pr-10"
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
                              La contraseña debe tener al menos 6 caracteres
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rol</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona un rol" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="ADMIN">
                                  Administrador
                                </SelectItem>
                                <SelectItem value="SUPPORT">Soporte</SelectItem>
                                <SelectItem value="CLIENT">Cliente</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              El rol determina los permisos del usuario
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            form.reset();
                            setIsDialogOpen(false);
                          }}
                          disabled={isCreating}
                        >
                          Cancelar
                        </Button>
                        <Button type="submit" disabled={isCreating}>
                          {isCreating ? "Creando..." : "Crear Usuario"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        {isLoading ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                Cargando usuarios...
              </div>
            </CardContent>
          </Card>
        ) : filteredUsers.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                {searchQuery || roleFilter !== "todos"
                  ? "No se encontraron usuarios con los filtros aplicados"
                  : "No hay usuarios registrados"}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>
                {filteredUsers.length}{" "}
                {filteredUsers.length === 1 ? "Usuario" : "Usuarios"}
              </CardTitle>
              <CardDescription>
                Gestiona los usuarios del sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha de Registro</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <UserAvatar name={user.name} />
                            <span>{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={getRoleBadgeColor(user.role)}
                          >
                            {getRoleLabel(user.role)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={user.active}
                              onCheckedChange={() =>
                                handleToggleStatus(user.id, user?.active!)
                              }
                            />
                            <span className="text-sm">
                              {user.active ? "Activo" : "Inactivo"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {user.createdAt
                            ? format(
                                new Date(user.createdAt),
                                "d 'de' MMM, yyyy",
                                {
                                  locale: es,
                                }
                              )
                            : "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="default"
                                size="sm"
                                className=" cursor-pointer "
                              >
                                Acciones
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleEditClick(user)}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() =>
                                  handleDeleteUser(user.id)
                                }
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dialog para Editar Usuario */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Editar Usuario</DialogTitle>
              <DialogDescription>
                Actualiza la información del usuario. Deja la contraseña vacía si no deseas cambiarla.
              </DialogDescription>
            </DialogHeader>

            <Form {...editForm}>
              <form
                onSubmit={editForm.handleSubmit(onEditSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Juan Pérez" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nueva Contraseña (Opcional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showEditPassword ? "text" : "password"}
                            placeholder="Dejar vacío para no cambiar"
                            className="pr-10"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowEditPassword(!showEditPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showEditPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Si deseas cambiar la contraseña, debe tener al menos 6 caracteres
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rol</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un rol" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ADMIN">Administrador</SelectItem>
                          <SelectItem value="SUPPORT">Soporte</SelectItem>
                          <SelectItem value="CLIENT">Cliente</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        El rol determina los permisos del usuario
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      editForm.reset();
                      setIsEditDialogOpen(false);
                      setSelectedUser(null);
                    }}
                    disabled={isUpdating}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? "Actualizando..." : "Actualizar Usuario"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">
                  Total Usuarios
                </p>
                <p className="text-3xl">{allUsers.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">
                  Usuarios Activos
                </p>
                <p className="text-3xl text-green-600">
                  {allUsers.filter((u) => u.active).length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">
                  Resultados Filtrados
                </p>
                <p className="text-3xl text-blue-600">{filteredUsers.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
