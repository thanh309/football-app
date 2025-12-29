import { Outlet, NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Calendar,
    Settings,
    Bell,
    LogOut,
    Menu,
    Shield,
    MapPin,
    Trophy,
    User
} from "lucide-react";
import { useState } from "react";
import { UserRole } from "@/types";
import clsx from "clsx";

// Mock User Role for now - in real app, get from Context/Store
const CURRENT_USER_ROLES: UserRole[] = [UserRole.PLAYER, UserRole.TEAM_LEADER];

const SIDEBAR_ITEMS = {
    common: [
        { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { label: "Community", path: "/community", icon: Users },
    ],
    [UserRole.PLAYER]: [
        { label: "My Profile", path: "/profile", icon: User },
        { label: "My Teams", path: "/my-teams", icon: Trophy },
        { label: "My Schedule", path: "/schedule", icon: Calendar },
    ],
    [UserRole.TEAM_LEADER]: [
        { label: "Manage Teams", path: "/leader/teams", icon: Users },
    ],
    [UserRole.FIELD_OWNER]: [
        { label: "My Fields", path: "/owner/fields", icon: MapPin },
        { label: "Bookings", path: "/owner/bookings", icon: Calendar },
    ],
    [UserRole.MODERATOR]: [
        { label: "Mod Dashboard", path: "/mod", icon: Shield },
        { label: "Pending Teams", path: "/mod/teams", icon: Users },
        { label: "Pending Fields", path: "/mod/fields", icon: MapPin },
        { label: "Reports", path: "/mod/reports", icon: Shield },
    ],
};

export const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Flatten items based on roles
    const navItems = [
        ...SIDEBAR_ITEMS.common,
        ...(CURRENT_USER_ROLES.includes(UserRole.PLAYER) ? SIDEBAR_ITEMS[UserRole.PLAYER] : []),
        ...(CURRENT_USER_ROLES.includes(UserRole.TEAM_LEADER) ? SIDEBAR_ITEMS[UserRole.TEAM_LEADER] : []),
        ...(CURRENT_USER_ROLES.includes(UserRole.FIELD_OWNER) ? SIDEBAR_ITEMS[UserRole.FIELD_OWNER] : []),
        ...(CURRENT_USER_ROLES.includes(UserRole.MODERATOR) ? SIDEBAR_ITEMS[UserRole.MODERATOR] : []),
    ];

    // Remove duplicates by path
    const uniqueNavItems = Array.from(new Map(navItems.map(item => [item.path, item])).values());

    return (
        <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <aside
                className={clsx(
                    "fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
                    <span className="text-xl font-bold text-primary-600">Kick-off</span>
                </div>

                <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
                    {uniqueNavItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                clsx(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
                                        : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                )
                            }
                        >
                            <item.icon className="h-5 w-5" />
                            {item.label}
                        </NavLink>
                    ))}

                    <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                        <NavLink to="/settings/account" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <Settings className="h-5 w-5" />
                            Settings
                        </NavLink>
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10">
                            <LogOut className="h-5 w-5" />
                            Logout
                        </button>
                    </div>
                </nav>
            </aside>

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header */}
                <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 md:px-8">
                    <button className="md:hidden p-2 -ml-2" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        <Menu className="h-6 w-6 text-gray-700 dark:text-gray-200" />
                    </button>

                    <div className="flex items-center gap-4 ml-auto">
                        <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                            <Bell className="h-6 w-6" />
                        </button>
                        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                            <img src="https://ui-avatars.com/api/?name=User" alt="User" />
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
};
