import api from '../axios';
import type { TeamWallet, TransactionLog, TransactionType } from '../../types';

export interface AddTransactionRequest {
    walletId: number;
    type: TransactionType;
    amount: number;
    description?: string;
    category?: string;
}

export interface TransactionFilters {
    type?: TransactionType;
    category?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
}

export interface FinanceSummary {
    balance: number;
    totalIncome: number;
    totalExpense: number;
    recentTransactions: TransactionLog[];
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export const financeService = {
    /**
     * Get team wallet
     */
    getTeamWallet: async (teamId: number): Promise<TeamWallet> => {
        const response = await api.get<TeamWallet>(`/teams/${teamId}/wallet`);
        return response.data;
    },

    /**
     * Add a transaction
     */
    addTransaction: async (data: AddTransactionRequest): Promise<TransactionLog> => {
        const response = await api.post<TransactionLog>('/transactions', data);
        return response.data;
    },

    /**
     * Get transaction history
     */
    getTransactionHistory: async (
        walletId: number,
        filters?: TransactionFilters
    ): Promise<PaginatedResponse<TransactionLog>> => {
        const response = await api.get<PaginatedResponse<TransactionLog>>(
            `/wallets/${walletId}/transactions`,
            { params: filters }
        );
        return response.data;
    },

    /**
     * Get finance summary
     */
    getFinanceSummary: async (teamId: number): Promise<FinanceSummary> => {
        const response = await api.get<FinanceSummary>(`/teams/${teamId}/finance/summary`);
        return response.data;
    },

    /**
     * Get transaction categories
     */
    getCategories: async (): Promise<string[]> => {
        const response = await api.get<string[]>('/transactions/categories');
        return response.data;
    },
};

export default financeService;
