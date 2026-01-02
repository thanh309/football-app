import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bell, ChevronRight } from 'lucide-react';
import { ChangePasswordForm } from '../../components/forms';
import { ConfirmationModal } from '../../components/common';
import { useAuth } from '../../contexts';
import toast from 'react-hot-toast';

const AccountSettingsPage: React.FC = () => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        try {
            // For now, just log out the user
            await logout();
            toast.success('Account deletion initiated. You have been logged out.');
            navigate('/');
        } catch {
            toast.error('Failed to process account deletion');
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Account Settings</h1>
                <p className="text-gray-600 mt-1">Manage your account preferences and security.</p>
            </div>

            {/* Account Info */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Account Information</h2>
                <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <p className="text-gray-900 bg-gray-50 rounded-lg px-4 py-2">johndoe</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <p className="text-gray-900 bg-gray-50 rounded-lg px-4 py-2">john.doe@example.com</p>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                            <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Active
                        </span>
                    </div>
                </div>
            </div>

            {/* Notification Settings Link */}
            <Link
                to="/settings/notifications"
                className="bg-white rounded-xl shadow-sm p-6 mb-6 flex items-center justify-between hover:bg-gray-50 transition-colors group"
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Bell className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Notification Settings</h2>
                        <p className="text-gray-600 text-sm">Manage how you receive notifications</p>
                    </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </Link>

            {/* Change Password */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Change Password</h2>
                <ChangePasswordForm />
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-red-100">
                <h2 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h2>
                <p className="text-gray-600 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                </p>
                <button
                    type="button"
                    onClick={() => setShowDeleteModal(true)}
                    className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >
                    Delete Account
                </button>
            </div>

            {/* Delete Account Confirmation Modal */}
            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteAccount}
                title="Delete Account?"
                message="Are you sure you want to delete your account? This action cannot be undone. You will be logged out immediately."
                confirmLabel="Delete Account"
                variant="danger"
                isLoading={isDeleting}
            />
        </div>
    );
};

export default AccountSettingsPage;

