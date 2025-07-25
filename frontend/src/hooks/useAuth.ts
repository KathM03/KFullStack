import { useAuthStore } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    getCurrentUser,
    logout,
    clearError,
  } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Solo intentar obtener el usuario si no estamos autenticados y no estamos cargando
    if (!isAuthenticated && !isLoading && typeof window !== "undefined") {
      getCurrentUser();
    }
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    logout: handleLogout,
    clearError,
  };
};

export const useRequireAuth = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  return { isAuthenticated, isLoading };
};
