import { createContext } from "react";

export interface AuthContextValue {
  isAuthenticated: boolean;
  handleLogout: () => void;
}

export const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  handleLogout: () => {},
});
