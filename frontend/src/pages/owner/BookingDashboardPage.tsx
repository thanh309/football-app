import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, DollarSign, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';

const BookingDashboardPage: React.FC = () => {
    // Mock stats for demonstration
    const stats = {
        totalBookings: 0,
        todayBookings: 0,
        pendingRequests: 0,
        thisMonthRevenue: 0,
        completedBookings: 0,
        cancelledBookings: 0,
    };

    const statCards = [
        { label: 'Total Bookings', value: stats.totalBookings, icon: Calendar, color: 'bg-blue-500' },
        { label: "Today's Bookings", value: stats.todayBookings, icon: Clock, color: 'bg-purple-500' },
        { label: 'Pending Requests', value: stats.pendingRequests, icon: TrendingUp, color: 'bg-yellow-500' },
        { label: 'This Month Revenue', value: `${stats.thisMonthRevenue.toLocaleString()} VND`, icon: DollarSign, color: 'bg-green-500' },
        { label: 'Completed', value: stats.completedBookings, icon: CheckCircle, color: 'bg-emerald-500' },
        { label: 'Cancelled', value: stats.cancelledBookings, icon: XCircle, color: 'bg-red-500' },
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Booking Dashboard</h1>
                <p className="text-gray-600 mt-1">
                    Overview of all bookings across your fields.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {statCards.map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`${stat.color} p-3 rounded-lg`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{stat.label}</p>
                                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
                    <Link
                        to="/owner/bookings/requests"
                        className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                    >
                        View All →
                    </Link>
                </div>

                <div className="text-center py-12 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <p>No recent bookings</p>
                    <p className="text-sm text-gray-400 mt-1">
                        Bookings will appear here once customers start booking your fields.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BookingDashboardPage;
