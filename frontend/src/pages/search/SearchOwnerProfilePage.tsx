import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Star } from 'lucide-react';
import { LoadingSpinner } from '../../components/common';

// Mock data for demonstration
const mockOwner = {
    ownerId: 1,
    username: 'John Field Owner',
    email: 'owner@example.com',
    avatarUrl: 'https://ui-avatars.com/api/?name=John+Owner&background=10b981&color=fff',
    bio: 'Passionate about providing quality football fields for the community. Managing multiple fields across the city with top-notch facilities.',
    phone: '+84 123 456 789',
    joinedAt: '2022-06-15T00:00:00Z',
};

const mockFields = [
    {
        fieldId: 1,
        fieldName: 'Thunder Arena',
        address: '123 Sports Street, District 1, HCMC',
        pricePerHour: 500000,
        rating: 4.8,
        imageUrl: 'https://via.placeholder.com/400x200',
    },
    {
        fieldId: 2,
        fieldName: 'Green Pitch Stadium',
        address: '456 Football Avenue, District 7, HCMC',
        pricePerHour: 700000,
        rating: 4.5,
        imageUrl: 'https://via.placeholder.com/400x200',
    },
    {
        fieldId: 3,
        fieldName: 'City Sports Complex',
        address: '789 Stadium Road, Thu Duc, HCMC',
        pricePerHour: 600000,
        rating: 4.9,
        imageUrl: 'https://via.placeholder.com/400x200',
    },
];

const SearchOwnerProfilePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = React.useState(true);
    const [owner, setOwner] = React.useState<typeof mockOwner | null>(null);
    const [fields, setFields] = React.useState<typeof mockFields>([]);

    React.useEffect(() => {
        // Simulate API call
        const timer = setTimeout(() => {
            setOwner(mockOwner);
            setFields(mockFields);
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!owner) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Owner Not Found</h2>
                    <Link to="/search/owners" className="text-emerald-600 hover:underline">
                        Browse Owners
                    </Link>
                </div>
            </div>
        );
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Back Button */}
            <Link
                to="/search/owners"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Owners
            </Link>

            {/* Owner Header */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                        <div className="w-32 h-32 rounded-xl bg-gray-100 overflow-hidden">
                            <img
                                src={owner.avatarUrl}
                                alt={owner.username}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                            {owner.username}
                        </h1>

                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">
                                Member since {new Date(owner.joinedAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long'
                                })}
                            </span>
                        </div>

                        <p className="text-gray-600 mb-4">{owner.bio}</p>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium">
                                {fields.length} Fields
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fields Section */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Fields by {owner.username}
                </h2>

                <div className="grid gap-4">
                    {fields.map((field) => (
                        <Link
                            key={field.fieldId}
                            to={`/search/fields/${field.fieldId}`}
                            className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            {/* Field Image */}
                            <div className="w-full md:w-48 h-32 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                                <img
                                    src={field.imageUrl}
                                    alt={field.fieldName}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Field Info */}
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-1">
                                    {field.fieldName}
                                </h3>
                                <p className="text-sm text-gray-600 flex items-center gap-1 mb-2">
                                    <MapPin className="w-4 h-4" />
                                    {field.address}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-emerald-600 font-semibold">
                                        {formatPrice(field.pricePerHour)}/hour
                                    </span>
                                    <span className="flex items-center gap-1 text-sm text-gray-600">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        {field.rating}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {fields.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        <p>This owner has no fields listed yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchOwnerProfilePage;
