import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useCurrentUser, useLogin, useLogout, authKeys } from '../api/hooks/useAuth';
import type { UserAccount, UserRole } from '../types';

interface AuthContextType {
    user: UserAccount | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const queryClient = useQueryClient();
    const { data: user, isLoading: isUserLoading } = useCurrentUser();
    const loginMutation = useLogin();
    const logoutMutation = useLogout();
    const [isInitialized, setIsInitialized] = useState(false);

    // Check for existing token on mount
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setIsInitialized(true);
        }
    }, []);

    // Once user query completes, mark as initialized
    useEffect(() => {
        if (!isUserLoading) {
            setIsInitialized(true);
        }
    }, [isUserLoading]);

    const login = async (username: string, password: string): Promise<void> => {
        await loginMutation.mutateAsync({ username, password });
    };

    const logout = async (): Promise<void> => {
        await logoutMutation.mutateAsync();
        queryClient.setQueryData(authKeys.user(), null);
    };

    const hasRole = (role: UserRole): boolean => {
        return user?.roles?.includes(role) ?? false;
    };

    const value: AuthContextType = {
        user: user ?? null,
        isLoading: !isInitialized || isUserLoading,
        isAuthenticated: !!user,
        login,
        logout,
        hasRole,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
