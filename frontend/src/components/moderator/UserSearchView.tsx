import { useState } from 'react';
import { Search, User, Eye } from 'lucide-react';
import { LoadingSpinner, EmptyState, Button } from '../common';
import { FormInput, FormSelect } from '../forms';
import { useSearchUsers } from '../../api/hooks/useModeration';
import type { UserAccount } from '../../types';
import { Link } from 'react-router-dom';

const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'Active', label: 'Active' },
    { value: 'Suspended', label: 'Suspended' },
    { value: 'Banned', label: 'Banned' },
];

const UserSearchView: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [submittedParams, setSubmittedParams] = useState<{ query?: string; status?: string }>({});

    const { data: usersResponse, isLoading } = useSearchUsers(submittedParams);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params: { query?: string; status?: string } = {};
        if (searchQuery.trim()) {
            params.query = searchQuery.trim();
        }
        if (statusFilter) {
            params.status = statusFilter;
        }
        setSubmittedParams(params);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-700';
            case 'Suspended':
                return 'bg-amber-100 text-amber-700';
            case 'Banned':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const users = usersResponse?.data || [];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="text-left">
                    <h2 className="text-xl font-bold text-gray-900 text-left">User Management</h2>
                    <p className="text-sm text-gray-500 text-left">Search and manage user accounts</p>
                </div>
            </div>

            <form onSubmit={handleSearch} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex gap-4">
                    <div className="flex-1">
                        <FormInput
                            label=""
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by username or email..."
                        />
                    </div>
                    <div className="w-48">
                        <FormSelect
                            label=""
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            options={statusOptions}
                        />
                    </div>
                    <Button type="submit" leftIcon={<Search className="w-4 h-4" />}>
                        Search
                    </Button>
                </div>
            </form>

            {isLoading ? (
                <LoadingSpinner text="Searching users..." />
            ) : users.length === 0 ? (
                <EmptyState
                    title="No Users Found"
                    description="No users match your search criteria"
                />
            ) : (
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">User</th>
                                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Email</th>
                                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Roles</th>
                                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Status</th>
                                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Joined</th>
                                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map((user: UserAccount) => (
                                <tr key={user.userId} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-sm font-medium text-indigo-600">
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-medium text-gray-900">{user.username}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600 text-center">{user.email}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 text-center">{user.roles.join(', ')}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(user.status)}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600 text-center">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <Link to={`/mod/users/${user.userId}`}>
                                            <Button size="sm" variant="ghost" leftIcon={<Eye className="w-4 h-4" />}>
                                                View
                                            </Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UserSearchView;
