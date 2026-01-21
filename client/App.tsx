import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { HRRoute, CandidateRoute } from "@/components/ProtectedRoutes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HRDashboard from "./pages/HRDashboard";
import CandidateProfile from "./pages/CandidateProfile";
import ScreeningPage from "./pages/ScreeningPage";
import ChatPage from "./pages/ChatPage";

const queryClient = new QueryClient();

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route
      path="/hr/dashboard"
      element={
        <HRRoute>
          <HRDashboard />
        </HRRoute>
      }
    />
    <Route
      path="/hr/screening/:jobId"
      element={
        <HRRoute>
          <ScreeningPage />
        </HRRoute>
      }
    />
    <Route
      path="/hr/chat"
      element={
        <HRRoute>
          <ChatPage />
        </HRRoute>
      }
    />
    <Route
      path="/candidate/profile"
      element={
        <CandidateRoute>
          <CandidateProfile />
        </CandidateRoute>
      }
    />
    <Route
      path="/candidate/applications"
      element={
        <CandidateRoute>
          <NotFound />
        </CandidateRoute>
      }
    />
    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
