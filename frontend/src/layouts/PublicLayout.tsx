import { Outlet, Link } from "react-router-dom";
import { Menu, X, Rocket } from "lucide-react";
import { useState } from "react";

export const PublicLayout = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {/* Navbar */}
            <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary-600">
                        <Rocket className="h-6 w-6" />
                        <span>Kick-off</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link to="/teams" className="text-sm font-medium hover:text-primary-600 transition-colors">Find Teams</Link>
                        <Link to="/fields" className="text-sm font-medium hover:text-primary-600 transition-colors">Book Fields</Link>
                        <Link to="/community" className="text-sm font-medium hover:text-primary-600 transition-colors">Community</Link>
                        <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 mx-2" />
                        <Link to="/login" className="text-sm font-medium hover:text-primary-600 transition-colors">Log in</Link>
                        <Link to="/register" className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Get Started
                        </Link>
                    </nav>

                    {/* Mobile Menu Toggle */}
                    <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Nav */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-4 flex flex-col gap-4">
                        <Link to="/teams" className="text-sm font-medium py-2">Find Teams</Link>
                        <Link to="/fields" className="text-sm font-medium py-2">Book Fields</Link>
                        <Link to="/community" className="text-sm font-medium py-2">Community</Link>
                        <hr className="border-gray-200 dark:border-gray-800" />
                        <Link to="/login" className="text-sm font-medium py-2">Log in</Link>
                        <Link to="/register" className="text-sm font-medium py-2 text-blue-600">Get Started</Link>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-200 dark:border-gray-800 py-8 bg-gray-50 dark:bg-gray-950">
                <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 font-bold text-lg">
                        <Rocket className="h-5 w-5" />
                        <span>Kick-off</span>
                    </div>
                    <p className="text-sm text-gray-500">© 2024 Kick-off Platform. All rights reserved.</p>
                    <div className="flex gap-6 text-sm text-gray-500">
                        <Link to="#" className="hover:text-gray-900 dark:hover:text-gray-100">Privacy</Link>
                        <Link to="#" className="hover:text-gray-900 dark:hover:text-gray-100">Terms</Link>
                        <Link to="#" className="hover:text-gray-900 dark:hover:text-gray-100">Contact</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};
