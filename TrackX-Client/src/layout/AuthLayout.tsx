import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { lazy } from "react";
const FallbackScreen = lazy(
  () => import("@/components/fallbackScreen/FallBackScreen")
);

const AuthLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <FallbackScreen />;
  return isAuthenticated ? (
    <Navigate to="/" replace />
  ) : (
    <main className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
      <Outlet />
    </main>
  );
};

export default AuthLayout;
