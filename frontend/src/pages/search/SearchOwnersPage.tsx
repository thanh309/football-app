import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { OwnerSearchFilter, EmptySearchState, type OwnerSearchFilters } from '../../components/search';
import { LoadingSpinner, PageContainer, PageHeader } from '../../components/common';
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
        <PageContainer maxWidth="xl">
            <PageHeader
                title="Search Field Owners"
                subtitle="Find football field owners and venues."
            />

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
                <EmptySearchState type="owner" query={searchQuery} />
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {owners.map((owner) => (
                        <div key={owner.userId} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                                    <span className="text-xl font-bold text-primary-600">
                                        {owner.username.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">{owner.username}</h3>
                                    <p className="text-sm text-slate-500">{owner.location}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {owner.isVerified && (
                                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                                            Verified
                                        </span>
                                    )}
                                </div>
                                <Link
                                    to={`/search/owners/${owner.userId}`}
                                    className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                                >
                                    View Profile
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </PageContainer>
    );
};

export default SearchOwnersPage;
