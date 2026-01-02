import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { PageContainer, PageHeader, ContentCard, LoadingSpinner } from '../../components/common';
import { useOwnerPendingBookings } from '../../api/hooks/useBooking';
import { useAuth } from '../../contexts';
import { useOwnerFields } from '../../api/hooks/useField';

const BookingDashboardPage: React.FC = () => {
    const { user } = useAuth();
    const { data: pendingBookings, isLoading: pendingLoading } = useOwnerPendingBookings();
    const { data: fields, isLoading: fieldsLoading } = useOwnerFields(user?.userId || 0);

    const isLoading = pendingLoading || fieldsLoading;

    // Calculate stats from real data
    const pendingCount = pendingBookings?.length || 0;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Confirmed':
            case 'Approved': return 'bg-emerald-100 text-emerald-700';
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            case 'Cancelled':
            case 'Rejected': return 'bg-red-100 text-red-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const statCards = [
        { label: 'My Fields', value: fields?.length || 0, icon: MapPin, color: 'bg-blue-500' },
        { label: 'Pending Requests', value: pendingCount, icon: Clock, color: 'bg-yellow-500' },
    ];

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
                                {isLoading ? (
                                    <LoadingSpinner size="sm" />
                                ) : (
                                    <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pending Bookings */}
            <ContentCard
                title="Pending Booking Requests"
                action={
                    <Link to="/owner/bookings/requests" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                        View All →
                    </Link>
                }
            >
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <LoadingSpinner />
                    </div>
                ) : pendingBookings && pendingBookings.length > 0 ? (
                    <div className="space-y-4">
                        {pendingBookings.slice(0, 5).map((booking) => (
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
                                        <p className="font-medium text-slate-900">Booking #{booking.bookingId}</p>
                                        <div className="flex items-center gap-3 text-sm text-slate-500">
                                            <span className="flex items-center gap-1"><Users className="w-3 h-3" />Team #{booking.teamId}</span>
                                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{booking.date}</span>
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{booking.startTime?.slice(0, 5)} - {booking.endTime?.slice(0, 5)}</span>
                                        </div>
                                    </div>
                                </div>
                                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(booking.status)}`}>
                                    {booking.status}
                                </span>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-slate-500">
                        <p>No pending booking requests.</p>
                    </div>
                )}
            </ContentCard>
        </PageContainer>
    );
};

export default BookingDashboardPage;
