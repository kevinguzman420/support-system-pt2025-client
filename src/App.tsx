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
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        {/* <Route path="/register" element={<Register />} /> */}

        {/* Cliente routes */}
        <Route
          path="/dashboard/cliente"
          element={
            <ProtectedRoute allowedRoles={["CLIENT"]}>
              <DashboardCliente />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/cliente/nueva-solicitud"
          element={
            <ProtectedRoute allowedRoles={["CLIENT"]}>
              <NuevaSolicitud />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/cliente/mis-solicitudes"
          element={
            <ProtectedRoute allowedRoles={["CLIENT"]}>
              <MisSolicitudes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/cliente/mis-solicitudes/:id"
          element={
            <ProtectedRoute allowedRoles={["CLIENT"]}>
              <DetalleSolicitud />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/cliente/perfil"
          element={
            <ProtectedRoute allowedRoles={["CLIENT"]}>
              <Perfil />
            </ProtectedRoute>
          }
        />

        {/* Soporte routes */}
        <Route
          path="/dashboard/soporte"
          element={
            <ProtectedRoute allowedRoles={["SUPPORT"]}>
              <DashboardSoporte />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/soporte/todas"
          element={
            <ProtectedRoute allowedRoles={["SUPPORT"]}>
              <DashboardSoporte />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/soporte/solicitudes/:id"
          element={
            <ProtectedRoute allowedRoles={["SUPPORT"]}>
              <DetalleSolicitud />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/soporte/perfil"
          element={
            <ProtectedRoute allowedRoles={["SUPPORT"]}>
              <Perfil />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/usuarios"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <GestionUsuarios />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/solicitudes"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <DashboardSoporte />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/solicitudes/:id"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <DetalleSolicitud />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/reportes"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Reportes />
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}
