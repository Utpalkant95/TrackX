import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { lazy } from "react";

const FallbackScreen = lazy(
  () => import("@/components/fallbackScreen/FallBackScreen")
);
const Navbar = lazy(() => import("@/components/navbar/Navbar"));

const MainLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <FallbackScreen />;

  return isAuthenticated ? (
    <main className={`font-sans antialiased bg-[#121212] text-white`}>
      <Navbar />
      <div className="pt-16">
        <Outlet />
      </div>
    </main>
  ) : (
    <Navigate to="/auth/login" replace />
  );
};

export default MainLayout;
