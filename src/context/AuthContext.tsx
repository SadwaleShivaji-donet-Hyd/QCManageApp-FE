import { createContext, useContext } from "react";
import type { ReactNode } from "react";

// import { useKeycloak } from "./KeycloakContext";
import { useKeycloak } from "./KeycloakContext";
interface AuthContextType {
  isAuthenticated: boolean;
  role: string | null;
  username: string | null;
  token: string | undefined;
  loading: boolean;
  login: (
    username: string,
    password: string,
  ) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, user, token, loading, login, logout } =
    useKeycloak();

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        role: user?.role ?? null,
        username: user?.username ?? null,
        token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
