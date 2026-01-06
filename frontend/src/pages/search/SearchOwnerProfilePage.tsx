import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, Star } from 'lucide-react';
import { LoadingSpinner, PageContainer, PageHeader, ContentCard } from '../../components/common';
import { useSearchOwners } from '../../api/hooks/useSearch';
import { useOwnerFields } from '../../api/hooks/useField';

const SearchOwnerProfilePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const ownerId = parseInt(id || '0', 10);

    // Use owner search to get owner by ID (alternatively, a dedicated hook could be created)
    const { data: ownersData, isLoading: ownerLoading } = useSearchOwners({ query: '' });
    const { data: fields, isLoading: fieldsLoading } = useOwnerFields(ownerId);

    const owner = ownersData?.data?.find(o => o.userId === ownerId);
    const isLoading = ownerLoading || fieldsLoading;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!owner) {
        return (
            <PageContainer maxWidth="md">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Owner Not Found</h2>
                    <Link to="/search/owners" className="text-primary-600 hover:underline">
                        Browse Owners
                    </Link>
                </div>
            </PageContainer>
        );
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    return (
        <PageContainer maxWidth="lg">
            <PageHeader
                title={owner.username}
                subtitle="Field Owner Profile"
                backLink={{ label: 'Back to Owners', to: '/search/owners' }}
            />

            {/* Owner Header */}
            <ContentCard className="mb-6">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                        <div className="w-32 h-32 rounded-xl bg-primary-100 overflow-hidden flex items-center justify-center">
                            <span className="text-4xl font-bold text-primary-600">
                                {owner.username.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{owner.username}</h1>
                        <div className="flex items-center gap-2 text-slate-600 mb-2">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">
                                Member since {new Date(owner.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                            </span>
                        </div>
                        {owner.location && (
                            <div className="flex items-center gap-2 text-slate-600 mb-4">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm">{owner.location}</span>
                            </div>
                        )}
                        <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium">
                                {fields?.length || 0} Fields
                            </span>
                        </div>
                    </div>
                </div>
            </ContentCard>

            {/* Fields Section */}
            <ContentCard title={`Fields by ${owner.username}`}>
                <div className="grid gap-4">
                    {fields && fields.length > 0 ? (
                        fields.map((field) => (
                            <Link
                                key={field.fieldId}
                                to={`/search/fields/${field.fieldId}`}
                                className="flex flex-col md:flex-row gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                            >
                                <div className="w-full md:w-48 h-32 rounded-lg bg-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                    <MapPin className="w-8 h-8 text-slate-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-slate-900 mb-1">{field.fieldName}</h3>
                                    <p className="text-sm text-slate-600 flex items-center gap-1 mb-2">
                                        <MapPin className="w-4 h-4" />
                                        {field.location}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-primary-600 font-semibold">{formatPrice(field.defaultPricePerHour)}/hour</span>
                                        <span className="flex items-center gap-1 text-sm text-slate-600">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            N/A
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center py-8 text-slate-500">
                            <p>This owner has no fields listed yet.</p>
                        </div>
                    )}
                </div>
            </ContentCard>
        </PageContainer>
    );
};

export default SearchOwnerProfilePage;
