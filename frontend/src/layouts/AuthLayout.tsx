import { Outlet, Link } from "react-router-dom";
import { Rocket } from "lucide-react";

export const AuthLayout = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
            <div className="mb-8">
                <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-primary-600">
                    <Rocket className="h-8 w-8" />
                    <span>Kick-off</span>
                </Link>
            </div>
            <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
                <Outlet />
            </div>
            <div className="mt-8 text-sm text-slate-500">
                &copy; 2024 Kick-off Platform.
            </div>
        </div>
    );
};
