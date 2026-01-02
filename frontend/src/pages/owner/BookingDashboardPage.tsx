import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, DollarSign, TrendingUp, Clock, CheckCircle, XCircle, MapPin, Users } from 'lucide-react';
import { PageContainer, PageHeader, ContentCard } from '../../components/common';

const BookingDashboardPage: React.FC = () => {
    const stats = {
        totalBookings: 15,
        todayBookings: 2,
        pendingRequests: 3,
        thisMonthRevenue: 7500000,
        completedBookings: 10,
        cancelledBookings: 2,
    };

    const recentBookings = [
        { bookingId: 1, fieldName: 'Green Valley Field', teamName: 'FC Thunder', date: '2025-01-20', time: '18:00 - 20:00', status: 'Confirmed' },
        { bookingId: 2, fieldName: 'Green Valley Field', teamName: 'City United', date: '2025-01-21', time: '19:00 - 21:00', status: 'Pending' },
        { bookingId: 3, fieldName: 'Sunrise Arena', teamName: 'Blue Eagles', date: '2025-01-22', time: '17:00 - 19:00', status: 'Confirmed' },
    ];

    const statCards = [
        { label: 'Total Bookings', value: stats.totalBookings, icon: Calendar, color: 'bg-blue-500' },
        { label: "Today's Bookings", value: stats.todayBookings, icon: Clock, color: 'bg-purple-500' },
        { label: 'Pending Requests', value: stats.pendingRequests, icon: TrendingUp, color: 'bg-yellow-500' },
        { label: 'This Month Revenue', value: `${stats.thisMonthRevenue.toLocaleString()} VND`, icon: DollarSign, color: 'bg-green-500' },
        { label: 'Completed', value: stats.completedBookings, icon: CheckCircle, color: 'bg-emerald-500' },
        { label: 'Cancelled', value: stats.cancelledBookings, icon: XCircle, color: 'bg-red-500' },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Confirmed': return 'bg-emerald-100 text-emerald-700';
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            case 'Cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <PageContainer maxWidth="lg">
            <PageHeader
                title="Booking Dashboard"
                subtitle="Overview of all bookings across your fields."
            />

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {statCards.map((stat) => (
                    <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                        <div className="flex items-center gap-4">
                            <div className={`${stat.color} p-3 rounded-lg`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">{stat.label}</p>
                                <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Bookings */}
            <ContentCard
                title="Recent Bookings"
                action={
                    <Link to="/owner/bookings/requests" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                        View All →
                    </Link>
                }
            >
                <div className="space-y-4">
                    {recentBookings.map((booking) => (
                        <Link
                            key={booking.bookingId}
                            to={`/owner/bookings/${booking.bookingId}`}
                            className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-primary-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900">{booking.fieldName}</p>
                                    <div className="flex items-center gap-3 text-sm text-slate-500">
                                        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{booking.teamName}</span>
                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{booking.date}</span>
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{booking.time}</span>
                                    </div>
                                </div>
                            </div>
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(booking.status)}`}>
                                {booking.status}
                            </span>
                        </Link>
                    ))}
                </div>
            </ContentCard>
        </PageContainer>
    );
};

export default BookingDashboardPage;
