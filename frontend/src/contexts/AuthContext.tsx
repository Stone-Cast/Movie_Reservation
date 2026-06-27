import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

interface AuthResponse {
    loggedIn: boolean;
    user: {
        sub: string;
        rol: number;
        name: string;
        theater?: number;
    };
}

interface AuthContextType {
    userData: AuthResponse | undefined;
    updateUserData: (data?: AuthResponse) => void;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

export const UserDataProvider = ({ children }: { children: ReactNode }) => {
    const [userData, setUserData] = useState<AuthResponse>();
    const [loading, setLoading] = useState(true);
    const apiUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        fetch(`${apiUrl}/auth/me`, { credentials: "include" })
            .then((res) => {
                if (!res.ok) throw new Error("Not logged in");
                return res.json();
            })
            .then((data) => updateUserData(data))
            .catch(() => updateUserData(undefined))
            .finally(() => setLoading(false));
    }, []);

    const updateUserData = (data: AuthResponse | undefined): void => {
        setUserData(data);
    };

    const contextValue = useMemo(
        () => ({
            userData,
            updateUserData,
            loading,
        }),
        [userData, updateUserData, loading]
    );

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useUserContext = () => {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error(
            "This context can only be used inside <UserDataProvider> wrapper tags."
        );
    return context;
};
