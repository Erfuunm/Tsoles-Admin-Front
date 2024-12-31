import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import ApiProvider from "./contexts/ApiProvider";
import { NextUIProvider } from "@nextui-org/react";

import ShipmentPage from "./pages/Dashboard";
import Dashboard from "./pages/Dashboard";
import IntegrationPage from "./pages/IntegrationPage";
import CallsPage from "./pages/CallsPage";
import LogsPage from "./pages/LogsPage";
import BugsPage from "./pages/BugsPage";
import TicketsPage from "./pages/TicketsPage";
import ExaminationPage from "./pages/ExaminationPage";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/logs"
        element={
          <ProtectedRoute>
            <LogsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/bugs"
        element={
          <ProtectedRoute>
            <BugsPage />
          </ProtectedRoute>
        }
      />
        <Route
        path="/tickets"
        element={
          <ProtectedRoute>
            <TicketsPage />
          </ProtectedRoute>
        }
      />
            <Route
        path="/examinations"
        element={
          <ProtectedRoute>
            <ExaminationPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <NextUIProvider>
      <ApiProvider>
        <BrowserRouter>
          <AuthProvider>
            <TooltipProvider>
              <AppRoutes />
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </AuthProvider>
        </BrowserRouter>
      </ApiProvider>
    </NextUIProvider>
  </QueryClientProvider>
);

export default App;
