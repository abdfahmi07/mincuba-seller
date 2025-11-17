import { useState, type ReactNode, useEffect } from "react";
import { AuthContext } from "./auth-context";
import { getAccessToken } from "@/services/api/axios";
import { logout } from "@/services/api/auth";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!getAccessToken()
  );

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
  };

  useEffect(() => {
    // bisa cek ke /me juga di sini
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
