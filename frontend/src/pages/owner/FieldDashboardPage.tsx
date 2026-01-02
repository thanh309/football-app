import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Edit, Image, DollarSign, MapPin, Clock, CheckCircle, Users } from 'lucide-react';
import { LoadingSpinner } from '../../components/common';
import { useField } from '../../api/hooks/useField';
import { FieldStatus } from '../../types';

const FieldDashboardPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { data: field, isLoading } = useField(Number(id));

    if (isLoading) {
        return <LoadingSpinner text="Loading field details..." />;
    }

    if (!field) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <h2 className="text-xl font-semibold text-gray-900">Field not found</h2>
                    <Link to="/owner/fields" className="text-emerald-600 hover:underline mt-2 inline-block">
                        Back to My Fields
                    </Link>
                </div>
            </div>
        );
    }

    const quickActions = [
        { label: 'Edit Field', icon: Edit, href: `/owner/fields/${id}/edit`, color: 'bg-blue-500' },
        { label: 'Manage Photos', icon: Image, href: `/owner/fields/${id}/photos`, color: 'bg-purple-500' },
        { label: 'Set Pricing', icon: DollarSign, href: `/owner/fields/${id}/pricing`, color: 'bg-green-500' },
        { label: 'View Calendar', icon: Calendar, href: `/owner/fields/${id}/calendar`, color: 'bg-orange-500' },
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <Link
                to="/owner/fields"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to My Fields
            </Link>

            {/* Field Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-8">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white">{field.fieldName}</h1>
                            <p className="text-white/80 mt-1 flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {field.location}
                            </p>
                        </div>
                        <span className={`text-sm px-3 py-1 rounded-full ${field.status === FieldStatus.VERIFIED
                            ? 'bg-white/20 text-white'
                            : 'bg-yellow-400 text-yellow-900'
                            }`}>
                            {field.status === FieldStatus.VERIFIED && <CheckCircle className="w-3 h-3 inline mr-1" />}
                            {field.status}
                        </span>
                    </div>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Price/Hour</p>
                            <p className="font-semibold text-gray-900">{field.defaultPricePerHour?.toLocaleString() || 'Not set'} VND</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Capacity</p>
                            <p className="font-semibold text-gray-900">{field.capacity || 'Not set'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <p className="font-semibold text-gray-900 capitalize">{field.status}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Owner ID</p>
                            <p className="font-semibold text-gray-900">{field.ownerId}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {quickActions.map((action) => (
                    <Link
                        key={action.label}
                        to={action.href}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow flex flex-col items-center text-center"
                    >
                        <div className={`${action.color} w-12 h-12 rounded-full flex items-center justify-center mb-3`}>
                            <action.icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-medium text-gray-900">{action.label}</span>
                    </Link>
                ))}
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Today's Bookings</p>
                            <p className="text-2xl font-bold text-gray-900">0</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-yellow-100 p-3 rounded-lg">
                            <Clock className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Pending Requests</p>
                            <p className="text-2xl font-bold text-gray-900">0</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-3 rounded-lg">
                            <Users className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">This Month's Bookings</p>
                            <p className="text-2xl font-bold text-gray-900">0</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FieldDashboardPage;

