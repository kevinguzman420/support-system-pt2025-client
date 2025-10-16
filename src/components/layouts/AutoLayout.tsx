import { HeadphonesIcon } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">{children}</div>
      </div>

      {/* Right side - Branding */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#1eb76f] to-[#1c8f5a] items-center justify-center p-8">
        <div className="text-white max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <HeadphonesIcon className="w-8 h-8" />
            </div>
            <h1 className="text-3xl">Sistema de Soporte</h1>
          </div>
          <p className="text-blue-100 text-lg mb-6">
            Gestiona todas tus solicitudes de soporte de manera eficiente y
            profesional.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-white mt-2"></div>
              <div>
                <h3 className="mb-1">Respuestas Rápidas</h3>
                <p className="text-blue-100 text-sm">
                  Nuestro equipo responde en menos de 24 horas
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-white mt-2"></div>
              <div>
                <h3 className="mb-1">Seguimiento en Tiempo Real</h3>
                <p className="text-blue-100 text-sm">
                  Mantente al tanto del estado de tus solicitudes
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-white mt-2"></div>
              <div>
                <h3 className="mb-1">Soporte Multicanal</h3>
                <p className="text-blue-100 text-sm">
                  Accede desde cualquier dispositivo
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
