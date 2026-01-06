import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    financeService,
    type AddTransactionRequest,
    type TransactionFilters
} from '../services/financeService';

export const financeKeys = {
    all: ['finance'] as const,
    wallet: (teamId: number) => [...financeKeys.all, 'wallet', teamId] as const,
    transactions: (walletId: number, filters?: TransactionFilters) =>
        [...financeKeys.all, 'transactions', walletId, filters] as const,
    summary: (teamId: number) => [...financeKeys.all, 'summary', teamId] as const,
    categories: () => [...financeKeys.all, 'categories'] as const,
};

export function useTeamWallet(teamId: number) {
    return useQuery({
        queryKey: financeKeys.wallet(teamId),
        queryFn: () => financeService.getTeamWallet(teamId),
        enabled: !!teamId,
    });
}

export function useTransactionHistory(teamId: number, filters?: TransactionFilters) {
    return useQuery({
        queryKey: financeKeys.transactions(teamId, filters),
        queryFn: () => financeService.getTransactionHistory(teamId, filters),
        enabled: !!teamId,
    });
}

export function useFinanceSummary(teamId: number) {
    return useQuery({
        queryKey: financeKeys.summary(teamId),
        queryFn: () => financeService.getFinanceSummary(teamId),
        enabled: !!teamId,
    });
}

export function useTransactionCategories() {
    return useQuery({
        queryKey: financeKeys.categories(),
        queryFn: () => financeService.getCategories(),
    });
}

export function useAddTransaction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: AddTransactionRequest) => financeService.addTransaction(data),
        onSuccess: (_, data) => {
            queryClient.invalidateQueries({ queryKey: financeKeys.all });
            queryClient.invalidateQueries({ queryKey: financeKeys.wallet(data.teamId) });
        },
    });
}
