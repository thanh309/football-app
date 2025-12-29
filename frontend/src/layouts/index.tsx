import { Outlet } from "react-router-dom";

export const MainLayout = () => (
    <div className="min-h-screen flex flex-col">
        <header className="p-4 border-b">Header</header>
        <main className="flex-1 p-4">
            <Outlet />
        </main>
        <footer className="p-4 border-t">Footer</footer>
    </div>
);

export const AuthLayout = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
            <Outlet />
        </div>
    </div>
);

export const DashboardLayout = () => (
    <div className="min-h-screen flex">
        <aside className="w-64 border-r p-4 hidden md:block">Sidebar</aside>
        <div className="flex-1 flex flex-col">
            <header className="p-4 border-b">Dashboard Header</header>
            <main className="p-4 flex-1">
                <Outlet />
            </main>
        </div>
    </div>
);
