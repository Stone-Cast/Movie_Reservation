import { useEffect, type ReactNode } from "react";
import { useUserContext } from "./AuthContext";
import { useLocation, useSearch } from "wouter";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { userData, loading } = useUserContext();
    const [location, setLocation] = useLocation();
    const search = useSearch();

    useEffect(() => {
        if (!loading && !userData) {
            const fullPath = search ? `${location}?${search}` : location;
            setLocation(`/sign-in?redirect=${encodeURIComponent(fullPath)}`);
        }
    }, [loading, userData, setLocation]);

    if (loading) return null;

    return userData ? <>{children}</> : null;
};
