"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ClientAuthGuardProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export const ClientAuthGuard: React.FC<ClientAuthGuardProps> = ({
    children,
    fallback,
}) => {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace("/login");
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
        return (
            fallback ?? (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            )
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
};
