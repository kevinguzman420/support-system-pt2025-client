import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";

// Auth pages
// import { Register } from "./pages/Register";

// Shared pages
// import { Perfil } from "./pages/Perfil";

// Cliente pages
// import { DashboardCliente } from "./pages/cliente/DashboardCliente";
// import { NuevaSolicitud } from "./pages/cliente/NuevaSolicitud";
// import { MisSolicitudes } from "./pages/cliente/MisSolicitudes";
// import { DetalleSolicitud } from "./pages/cliente/DetalleSolicitud";

// Soporte pages
// import { DashboardSoporte } from "./pages/soporte/DashboardSoporte";

// Admin pages
// import { DashboardAdmin } from "./pages/admin/DashboardAdmin";
// import { GestionUsuarios } from "./pages/admin/GestionUsuarios";
// import { Reportes } from "./pages/admin/Reportes";
import { Login } from "./components/Login";
import { DashboardAdmin } from "./components/admin/DashboardAdmin";
import { GestionUsuarios } from "./components/admin/GestionUsuarios";
import { Reportes } from "./components/admin/Reports";
import { DashboardSoporte } from "./components/soporte/DashboardSoporte";
import { DashboardCliente } from "./components/client/DashboardClient";
import { NuevaSolicitud } from "./components/client/NuevaSolicitud";
import { MisSolicitudes } from "./components/client/MisSolicitudes";
import { DetalleSolicitud } from "./pages/DetalleSolicitud";
import { Perfil } from "./pages/Perfil";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/register" element={<Register />} /> */}

        {/* Cliente routes */}
        <Route path="/dashboard/cliente" element={<DashboardCliente />} />
        <Route
          path="/dashboard/cliente/nueva-solicitud"
          element={<NuevaSolicitud />}
        />
        <Route
          path="/dashboard/cliente/mis-solicitudes"
          element={<MisSolicitudes />}
        />
        <Route
          path="/dashboard/cliente/mis-solicitudes/:id"
          element={<DetalleSolicitud />}
        />
        <Route path="/dashboard/cliente/perfil" element={<Perfil />} />

        {/* Soporte routes */}
        <Route path="/dashboard/soporte" element={<DashboardSoporte />} />
        <Route path="/dashboard/soporte/todas" element={<DashboardSoporte />} />
        <Route
          path="/dashboard/soporte/solicitudes/:id"
          element={<DetalleSolicitud />}
        />
        <Route path="/dashboard/soporte/perfil" element={<Perfil />} />

        {/* Admin routes */}
        <Route path="/dashboard/admin" element={<DashboardAdmin />} />
        <Route path="/dashboard/admin/usuarios" element={<GestionUsuarios />} />
        <Route
          path="/dashboard/admin/solicitudes"
          element={<DashboardSoporte />}
        />
        <Route
          path="/dashboard/admin/solicitudes/:id"
          element={<DetalleSolicitud />}
        />
        <Route path="/dashboard/admin/reportes" element={<Reportes />} />

        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}
