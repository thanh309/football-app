import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AddTransactionForm } from '../../components/forms';

const AddTransactionPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const handleSuccess = () => {
        navigate(`/leader/teams/${id}/finance`);
    };

    const handleCancel = () => {
        navigate(`/leader/teams/${id}/finance`);
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            {/* Back link */}
            <Link
                to={`/leader/teams/${id}/finance`}
                className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Finance
            </Link>

            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Add Transaction</h1>
                <p className="text-gray-600 mt-1">Record a new income or expense for your team.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
                <AddTransactionForm
                    walletId={Number(id)}
                    onSuccess={handleSuccess}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    );
};

export default AddTransactionPage;
