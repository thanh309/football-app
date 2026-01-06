import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Edit, Image, DollarSign, MapPin, Clock, CheckCircle, Users } from 'lucide-react';
import { LoadingSpinner, PageContainer, PageHeader, ContentCard } from '../../components/common';
import { useField } from '../../api/hooks/useField';
import { useOwnerPendingBookings, useFieldCalendar } from '../../api/hooks/useBooking';
import { FieldStatus, CalendarStatus } from '../../types';

const FieldDashboardPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const fieldId = Number(id);
    const { data: field, isLoading: fieldLoading } = useField(fieldId);
    const { data: pendingBookings, isLoading: bookingsLoading } = useOwnerPendingBookings();

    // Get calendar for current month to calculate stats
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const { data: calendar, isLoading: calendarLoading } = useFieldCalendar(fieldId, {
        startDate: startOfMonth.toISOString().split('T')[0],
        endDate: endOfMonth.toISOString().split('T')[0],
    });

    // Calculate stats from calendar data
    const stats = useMemo(() => {
        if (!calendar) return { todayBookings: 0, monthBookings: 0 };

        const todayStr = today.toISOString().split('T')[0];
        const todayBookings = calendar.filter(
            slot => slot.date === todayStr && slot.status === CalendarStatus.BOOKED
        ).length;

        const monthBookings = calendar.filter(
            slot => slot.status === CalendarStatus.BOOKED
        ).length;

        return { todayBookings, monthBookings };
    }, [calendar, today]);

    if (fieldLoading) {
        return <LoadingSpinner text="Loading field details..." />;
    }

    if (!field) {
        return (
            <PageContainer maxWidth="lg">
                <div className="text-center py-12">
                    <h2 className="text-xl font-semibold text-slate-900">Field not found</h2>
                    <Link to="/owner/fields" className="text-primary-600 hover:underline mt-2 inline-block">
                        Back to My Fields
                    </Link>
                </div>
            </PageContainer>
        );
    }

    const quickActions = [
        { label: 'Edit Field', icon: Edit, href: `/owner/fields/${id}/edit`, color: 'bg-blue-500' },
        { label: 'Manage Photos', icon: Image, href: `/owner/fields/${id}/photos`, color: 'bg-purple-500' },
        { label: 'Set Pricing', icon: DollarSign, href: `/owner/fields/${id}/pricing`, color: 'bg-green-500' },
        { label: 'View Calendar', icon: Calendar, href: `/owner/fields/${id}/calendar`, color: 'bg-orange-500' },
    ];

    return (
        <PageContainer maxWidth="lg">
            <PageHeader
                title={field.fieldName}
                subtitle={
                    <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {field.location}
                    </span>
                }
                backLink={{ label: 'Back to My Fields', to: '/owner/fields' }}
                action={
                    <span className={`text-sm px-3 py-1 rounded-full ${field.status === FieldStatus.VERIFIED
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {field.status === FieldStatus.VERIFIED && <CheckCircle className="w-3 h-3 inline mr-1" />}
                        {field.status}
                    </span>
                }
            />

            {/* Field Info */}
            <ContentCard className="mb-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <p className="text-sm text-slate-500">Price/Hour</p>
                        <p className="font-semibold text-slate-900">${field.defaultPricePerHour?.toLocaleString() || 'Not set'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Capacity</p>
                        <p className="font-semibold text-slate-900">{field.capacity || 'Not set'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Status</p>
                        <p className="font-semibold text-slate-900 capitalize">{field.status}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Owner ID</p>
                        <p className="font-semibold text-slate-900">{field.ownerId}</p>
                    </div>
                </div>
            </ContentCard>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {quickActions.map((action) => (
                    <Link
                        key={action.label}
                        to={action.href}
                        className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 hover:shadow-md transition-shadow flex flex-col items-center text-center group"
                    >
                        <div className={`${action.color} w-12 h-12 rounded-full flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                            <action.icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-medium text-slate-900">{action.label}</span>
                    </Link>
                ))}
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <ContentCard>
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Today's Bookings</p>
                            {calendarLoading ? (
                                <LoadingSpinner size="sm" />
                            ) : (
                                <p className="text-2xl font-bold text-slate-900">{stats.todayBookings}</p>
                            )}
                        </div>
                    </div>
                </ContentCard>
                <ContentCard>
                    <div className="flex items-center gap-3">
                        <div className="bg-yellow-100 p-3 rounded-lg">
                            <Clock className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Pending Requests</p>
                            {bookingsLoading ? (
                                <LoadingSpinner size="sm" />
                            ) : (
                                <p className="text-2xl font-bold text-slate-900">{pendingBookings?.length || 0}</p>
                            )}
                        </div>
                    </div>
                </ContentCard>
                <ContentCard>
                    <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-3 rounded-lg">
                            <Users className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">This Month's Bookings</p>
                            {calendarLoading ? (
                                <LoadingSpinner size="sm" />
                            ) : (
                                <p className="text-2xl font-bold text-slate-900">{stats.monthBookings}</p>
                            )}
                        </div>
                    </div>
                </ContentCard>
            </div>
        </PageContainer>
    );
};

export default FieldDashboardPage;
