import { useState } from "react";
import { Mail, Save, Clock, HeadsetIcon } from "lucide-react";
import { DashboardLayout } from "../components/layouts/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { UserAvatar } from "../components/UserAvatar";
import { Badge } from "../components/ui/badge";
import { getRoleLabel } from "../lib/mock-data";
import { toast } from "sonner";
import { userStore } from "@/store/user.store";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { updateUsegrPasswordApi } from "@/api/profile.api";

export function Perfil() {
  const { user: currentUser } = userStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const handleSave = () => {
    toast.success("Perfil actualizado correctamente");
    setIsEditing(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await updateUsegrPasswordApi(newPassword);
    if (response.success) {
      toast.success("Contraseña actualizada correctamente");
      setNewPassword("");
      setIsDialogOpen(false);
    } else {
      toast.error(response.message || "Error al actualizar la contraseña");
    }
  };

  return (
    <DashboardLayout
      user={currentUser!}
      title="Mi Perfil"
      breadcrumbs={[
        { label: "Dashboard", path: `/dashboard/${currentUser?.role}` },
        { label: "Mi Perfil" },
      ]}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <UserAvatar name={currentUser?.name!} className="w-20 h-20" />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2>{currentUser?.name}</h2>
                  <Badge variant="outline">
                    {getRoleLabel(currentUser?.role!)}
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-1">
                  {currentUser?.email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
            <CardDescription>
              {isEditing
                ? "Actualiza tu información personal"
                : "Tu información de perfil"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre completo</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={currentUser?.name}
                    onChange={(e) => {
                      // Aquí puedes agregar la lógica para actualizar el nombre si lo necesitas
                      console.log("Nuevo nombre:", e.target.value);
                    }}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2">
                    <span>{currentUser?.name}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex items-center gap-2 p-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{currentUser?.email}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Registrado desde:</Label>
                <div className="flex items-center gap-2 p-2 pl-0">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {format(
                      new Date(currentUser?.createdAt! || Date.now()),
                      "d MMM yy",
                      {
                        locale: es,
                      }
                    )}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Consultas realizadas</Label>
                <div className="flex items-center gap-2 p-2 pl-0 ">
                  <HeadsetIcon className="w-4 h-4 text-muted-foreground" />
                  <span>{currentUser?.requestsCount}</span>
                </div>
              </div>
            </div>

            {isEditing && (
              <>
                <Separator />
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Cambios
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Configuración de Cuenta</CardTitle>
            <CardDescription>
              Gestiona la seguridad de tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="mb-1">Cambiar Contraseña</h4>
                <p className="text-sm text-muted-foreground">
                  Actualiza tu contraseña regularmente para mantener tu cuenta
                  segura
                </p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">Cambiar</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <form onSubmit={handlePasswordSubmit}>
                    <DialogHeader>
                      <DialogTitle>Cambiar Contraseña</DialogTitle>
                      <DialogDescription>
                        Ingresa tu nueva contraseña. Asegúrate de que sea
                        segura.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="password">Nueva Contraseña</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Ingresa tu nueva contraseña"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          minLength={6}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsDialogOpen(false);
                          setNewPassword("");
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit">Actualizar Contraseña</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
