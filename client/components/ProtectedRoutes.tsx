import React from "react";
import { Navigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";

export const HRRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { auth } = useApp();
  
  if (!auth.isAuthenticated || auth.role !== "hr") {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

export const CandidateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { auth } = useApp();
  
  if (!auth.isAuthenticated || auth.role !== "candidate") {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};
