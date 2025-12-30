import React, { useState } from 'react';
import {
    OwnerSearchFilter,
    EmptySearchState,
    type OwnerSearchFilters,
} from '../../components/search';
import { LoadingSpinner } from '../../components/common';
import { AccountStatus, UserRole, type UserAccount } from '../../types';

// Mock data for owners
const mockOwners: UserAccount[] = [
    {
        userId: 10,
        username: 'greenvalleysports',
        email: 'contact@greenvalley.com',
        passwordHash: '',
        roles: [UserRole.FIELD_OWNER],
        status: AccountStatus.ACTIVE,
        isVerified: true,
        location: 'District 7, Ho Chi Minh City',
        contactInfo: '0901234567',
        createdAt: '2022-06-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
    },
    {
        userId: 11,
        username: 'sunrisesports',
        email: 'info@sunrise.com',
        passwordHash: '',
        roles: [UserRole.FIELD_OWNER],
        status: AccountStatus.ACTIVE,
        isVerified: true,
        location: 'Binh Thanh District',
        contactInfo: '0909876543',
        createdAt: '2022-08-15T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
    },
    {
        userId: 12,
        username: 'centralparkarena',
        email: 'hello@centralpark.com',
        passwordHash: '',
        roles: [UserRole.FIELD_OWNER],
        status: AccountStatus.ACTIVE,
        isVerified: true,
        location: 'District 1',
        contactInfo: '0905555555',
        createdAt: '2022-09-20T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
    },
];

const SearchOwnersPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [owners, setOwners] = useState<UserAccount[]>(mockOwners);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const handleSearch = (filters: OwnerSearchFilters) => {
        setSearchQuery(filters.query || '');
        setLoading(true);
        // Simulate search
        setTimeout(() => {
            let filtered = [...mockOwners];
            if (filters.query) {
                filtered = filtered.filter((o) =>
                    o.username.toLowerCase().includes(filters.query.toLowerCase())
                );
            }
            if (filters.location) {
                filtered = filtered.filter((o) =>
                    o.location?.toLowerCase().includes(filters.location!.toLowerCase())
                );
            }
            setOwners(filtered);
            setLoading(false);
        }, 300);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Search Field Owners</h1>
                <p className="text-gray-600 mt-1">Find football field owners and venues.</p>
            </div>

            {/* Filters */}
            <div className="mb-6">
                <OwnerSearchFilter onSearch={handleSearch} isLoading={loading} />
            </div>

            {/* Results */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner size="lg" />
                </div>
            ) : owners.length === 0 ? (
                <EmptySearchState
                    type="owner"
                    query={searchQuery}
                />
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {owners.map((owner) => (
                        <div
                            key={owner.userId}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                                    <span className="text-xl font-bold text-emerald-600">
                                        {owner.username.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{owner.username}</h3>
                                    <p className="text-sm text-gray-500">{owner.location}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {owner.isVerified && (
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                        Verified
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchOwnersPage;
