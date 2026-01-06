import { Outlet, Link } from "react-router-dom";
import { Menu, X, Rocket } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts";

export const PublicLayout = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isAuthenticated, user } = useAuth();

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
            {/* Navbar */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary-600">
                        <Rocket className="h-6 w-6" />
                        <span>Kick-off</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link to="/search/teams" className="text-sm font-medium hover:text-primary-600 transition-colors">Find Teams</Link>
                        <Link to="/search/fields" className="text-sm font-medium hover:text-primary-600 transition-colors">Book Fields</Link>
                        <Link to="/search/players" className="text-sm font-medium hover:text-primary-600 transition-colors">Find Players</Link>
                        <Link to="/search/owners" className="text-sm font-medium hover:text-primary-600 transition-colors">Find Owners</Link>
                        <Link to="/community" className="text-sm font-medium hover:text-primary-600 transition-colors">Community</Link>
                        <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-2" />
                        {isAuthenticated ? (
                            <>
                                <Link to="/dashboard" className="text-sm font-medium hover:text-primary-600 transition-colors">Dashboard</Link>
                                <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                    <img src={`https://ui-avatars.com/api/?name=${user?.username || 'User'}`} alt="User" />
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm font-medium hover:text-primary-600 transition-colors">Log in</Link>
                                <Link to="/register" className="text-sm font-medium bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* Mobile Menu Toggle */}
                    <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Nav */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 flex flex-col gap-4">
                        <Link to="/search/teams" className="text-sm font-medium py-2">Find Teams</Link>
                        <Link to="/search/fields" className="text-sm font-medium py-2">Book Fields</Link>
                        <Link to="/search/players" className="text-sm font-medium py-2">Find Players</Link>
                        <Link to="/search/owners" className="text-sm font-medium py-2">Find Owners</Link>
                        <Link to="/community" className="text-sm font-medium py-2">Community</Link>
                        <hr className="border-slate-200 dark:border-slate-800" />
                        {isAuthenticated ? (
                            <Link to="/dashboard" className="text-sm font-medium py-2 text-primary-600">Dashboard</Link>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm font-medium py-2">Log in</Link>
                                <Link to="/register" className="text-sm font-medium py-2 text-primary-600">Get Started</Link>
                            </>
                        )}
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-200 dark:border-slate-800 py-8 bg-slate-50 dark:bg-slate-950">
                <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 font-bold text-lg">
                        <Rocket className="h-5 w-5" />
                        <span>Kick-off</span>
                    </div>
                    <p className="text-sm text-slate-500">© 2025 Kick-off Platform. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};
