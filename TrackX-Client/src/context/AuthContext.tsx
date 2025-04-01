import { createContext, useContext } from "react";
import { useCheckAuth } from "@/hooks";

// Define the type for the authentication context
interface IAuthContext {
  isAuthenticated: boolean;
  isLoading: boolean;
  refetch: () => void;
}

// Create the context with an initial null value
const AuthContext = createContext<IAuthContext | null>(null);

// AuthProvider component
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, refetch } = useCheckAuth();

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, refetch }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context safely
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;