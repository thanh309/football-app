import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bell, ChevronRight } from 'lucide-react';
import { PageContainer, PageHeader, ContentCard, ConfirmationModal } from '../../components/common';
import { ChangePasswordForm } from '../../components/forms';
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
        <PageContainer maxWidth="md">
            <PageHeader
                title="Account Settings"
                subtitle="Manage your account preferences and security."
            />

            {/* Account Info */}
            <ContentCard title="Account Information" className="mb-6">
                <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                            <p className="text-slate-900 bg-slate-50 rounded-lg px-4 py-2">johndoe</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <p className="text-slate-900 bg-slate-50 rounded-lg px-4 py-2">john.doe@example.com</p>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Account Status</label>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                            Active
                        </span>
                    </div>
                </div>
            </ContentCard>

            {/* Notification Settings Link */}
            <Link
                to="/settings/notifications"
                className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6 flex items-center justify-between hover:bg-slate-50 transition-colors group block"
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Bell className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">Notification Settings</h2>
                        <p className="text-slate-600 text-sm">Manage how you receive notifications</p>
                    </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </Link>

            {/* Change Password */}
            <ContentCard title="Change Password" className="mb-6">
                <ChangePasswordForm />
            </ContentCard>

            {/* Danger Zone */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 border-l-4 border-l-red-500">
                <h2 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h2>
                <p className="text-slate-600 mb-4">
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
                message="Are you sure you want to delete your account? This action cannot be undone."
                confirmLabel="Delete Account"
                variant="danger"
                isLoading={isDeleting}
            />
        </PageContainer>
    );
};

export default AccountSettingsPage;
