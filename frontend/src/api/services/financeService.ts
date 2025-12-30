// @ts-ignore - Keeping api import for future use when switching back to real API
import api from '../axios';
import type { TeamWallet, TransactionLog, TransactionType } from '../../types';
import { TransactionType as TransactionTypeEnum } from '../../types';

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

// --- Mock Data ---
const mockTeamWallet: TeamWallet = {
    walletId: 1,
    teamId: 1,
    balance: 2500000,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2025-01-10T15:30:00Z',
};

const mockTransactionLogs: TransactionLog[] = [
    {
        transactionId: 1,
        walletId: 1,
        type: TransactionTypeEnum.INCOME,
        amount: 500000,
        description: 'Monthly member fees collected',
        category: 'Member Fees',
        createdBy: 1,
        createdAt: '2025-01-01T10:00:00Z',
    },
    {
        transactionId: 2,
        walletId: 1,
        type: TransactionTypeEnum.EXPENSE,
        amount: 300000,
        description: 'Field rental for practice session',
        category: 'Field Rental',
        createdBy: 1,
        createdAt: '2025-01-05T14:00:00Z',
    },
    {
        transactionId: 3,
        walletId: 1,
        type: TransactionTypeEnum.EXPENSE,
        amount: 150000,
        description: 'New footballs purchase',
        category: 'Equipment',
        createdBy: 1,
        createdAt: '2025-01-08T11:00:00Z',
    },
    {
        transactionId: 4,
        walletId: 1,
        type: TransactionTypeEnum.INCOME,
        amount: 200000,
        description: 'Sponsorship from local business',
        category: 'Sponsorship',
        createdBy: 1,
        createdAt: '2025-01-10T09:00:00Z',
    },
];

const mockCategories: string[] = [
    'Match Fee',
    'Field Rental',
    'Equipment',
    'Member Fees',
    'Sponsorship',
    'Transportation',
    'Uniforms',
    'Medical',
    'Other',
];

export const financeService = {
    /**
     * Get team wallet
     */
    getTeamWallet: async (_teamId: number): Promise<TeamWallet> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<TeamWallet>(`/teams/${teamId}/wallet`);
        // return response.data;
        // --- End Real API call ---

        return mockTeamWallet;
    },

    /**
     * Add a transaction
     */
    addTransaction: async (data: AddTransactionRequest): Promise<TransactionLog> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.post<TransactionLog>('/transactions', data);
        // return response.data;
        // --- End Real API call ---

        return {
            transactionId: Math.floor(Math.random() * 1000) + 100,
            walletId: data.walletId,
            type: data.type,
            amount: data.amount,
            description: data.description,
            category: data.category,
            createdBy: 1, // Assume current user
            createdAt: new Date().toISOString(),
        };
    },

    /**
     * Get transaction history
     */
    getTransactionHistory: async (
        _walletId: number,
        filters?: TransactionFilters
    ): Promise<PaginatedResponse<TransactionLog>> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<PaginatedResponse<TransactionLog>>(
        //     `/wallets/${walletId}/transactions`,
        //     { params: filters }
        // );
        // return response.data;
        // --- End Real API call ---

        const page = filters?.page || 1;
        const limit = filters?.limit || 10;

        let filteredLogs = [...mockTransactionLogs];

        if (filters?.type) {
            filteredLogs = filteredLogs.filter(t => t.type === filters.type);
        }
        if (filters?.category) {
            filteredLogs = filteredLogs.filter(t => t.category === filters.category);
        }

        return {
            data: filteredLogs,
            total: filteredLogs.length,
            page,
            limit,
            totalPages: Math.ceil(filteredLogs.length / limit),
        };
    },

    /**
     * Get finance summary
     */
    getFinanceSummary: async (_teamId: number): Promise<FinanceSummary> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<FinanceSummary>(`/teams/${teamId}/finance/summary`);
        // return response.data;
        // --- End Real API call ---

        const totalIncome = mockTransactionLogs
            .filter(t => t.type === TransactionTypeEnum.INCOME)
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpense = mockTransactionLogs
            .filter(t => t.type === TransactionTypeEnum.EXPENSE)
            .reduce((sum, t) => sum + t.amount, 0);

        return {
            balance: mockTeamWallet.balance,
            totalIncome,
            totalExpense,
            recentTransactions: mockTransactionLogs.slice(0, 5),
        };
    },

    /**
     * Get transaction categories
     */
    getCategories: async (): Promise<string[]> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate latency

        // --- Real API call (commented out for mock mode) ---
        // const response = await api.get<string[]>('/transactions/categories');
        // return response.data;
        // --- End Real API call ---

        return mockCategories;
    },
};

export default financeService;
