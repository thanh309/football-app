import React from 'react';
import { LoginForm } from '../../components/forms';

const LoginPage: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 px-4 py-12">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
