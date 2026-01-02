import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
            <div className="text-center">
                <div className="mb-8">
                    <span className="text-9xl font-bold text-primary-500">404</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                    Page Not Found
                </h1>
                <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
                    Oops! The page you're looking for doesn't exist or has been moved.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors shadow-sm"
                    >
                        <Home className="w-5 h-5 mr-2" />
                        Go Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center justify-center px-6 py-3 border-2 border-slate-300 text-base font-medium rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
