import api from '../axios';
import type { TeamWallet, TransactionLog, TransactionType } from '../../types';

export interface AddTransactionRequest {
    teamId: number;
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

// Finance service - Real API calls
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
        // Backend has separate endpoints for income (deposit) and expense
        const endpoint = data.type === 'Income' 
            ? `/teams/${data.teamId}/wallet/deposit`
            : `/teams/${data.teamId}/wallet/expense`;
        const response = await api.post<TransactionLog>(endpoint, {
            type: data.type,
            amount: data.amount,
            description: data.description,
            category: data.category,
        });
        return response.data;
    },

    /**
     * Get transaction history
     */
    getTransactionHistory: async (
        teamId: number,
        filters?: TransactionFilters
    ): Promise<PaginatedResponse<TransactionLog>> => {
        const response = await api.get<TransactionLog[]>(
            `/teams/${teamId}/wallet/transactions`,
            { params: filters }
        );
        return {
            data: response.data,
            total: response.data.length,
            page: filters?.page || 1,
            limit: filters?.limit || 20,
            totalPages: 1,
        };
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
