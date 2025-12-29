import { Wallet, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { LoadingSpinner, EmptyState } from '../common';
import { useTeamWallet, useTransactionHistory } from '../../api/hooks/useFinance';
import { Link } from 'react-router-dom';
import type { TransactionLog } from '../../types';

interface FinanceDashboardViewProps {
    teamId: number;
}

const FinanceDashboardView: React.FC<FinanceDashboardViewProps> = ({ teamId }) => {
    const { data: wallet, isLoading: walletLoading } = useTeamWallet(teamId);
    const walletId = wallet?.walletId || 0;
    const { data: transactionsData } = useTransactionHistory(walletId);

    if (walletLoading) {
        return <LoadingSpinner text="Loading finances..." />;
    }

    if (!wallet) {
        return (
            <EmptyState
                title="No Wallet Found"
                description="Your team's wallet hasn't been set up yet."
            />
        );
    }

    const transactions = transactionsData?.data || [];
    const recentTransactions = transactions.slice(0, 5);
    const incomeTotal = transactions.filter((t: TransactionLog) => t.type === 'Income').reduce((sum: number, t: TransactionLog) => sum + t.amount, 0);
    const expenseTotal = transactions.filter((t: TransactionLog) => t.type === 'Expense').reduce((sum: number, t: TransactionLog) => sum + t.amount, 0);

    return (
        <div className="space-y-6">
            {/* Balance Card */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                    <Wallet className="w-6 h-6" />
                    <span className="font-medium">Team Balance</span>
                </div>
                <p className="text-4xl font-bold">
                    ${wallet.balance.toLocaleString()}
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-5 border border-gray-100">
                    <div className="flex items-center gap-2 text-green-600 mb-2">
                        <TrendingUp className="w-5 h-5" />
                        <span className="font-medium">Income</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                        +{incomeTotal.toLocaleString()}
                    </p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-100">
                    <div className="flex items-center gap-2 text-red-600 mb-2">
                        <TrendingDown className="w-5 h-5" />
                        <span className="font-medium">Expenses</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                        -{expenseTotal.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-xl border border-gray-100">
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
                    <Link
                        to={`/leader/finance/${walletId}/transactions`}
                        className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                    >
                        View All
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {recentTransactions.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No transactions yet
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {recentTransactions.map((tx: TransactionLog) => (
                            <div key={tx.transactionId} className="flex items-center justify-between p-4">
                                <div>
                                    <p className="font-medium text-gray-900">{tx.description || 'No description'}</p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(tx.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className={`font-semibold ${tx.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>
                                    {tx.type === 'Income' ? '+' : '-'}{tx.amount.toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FinanceDashboardView;
