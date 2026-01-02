import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { PageContainer, PageHeader } from '../../components/common';
import { useAuth } from '../../contexts';
import { CommunityFeedView } from '../../components/community';

const CommunityFeedPage: React.FC = () => {
    const { isAuthenticated } = useAuth();

    return (
        <PageContainer maxWidth="md">
            <PageHeader
                title="Community"
                subtitle="Connect with the football community."
                action={
                    isAuthenticated ? (
                        <Link
                            to="/community/create"
                            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            New Post
                        </Link>
                    ) : undefined
                }
            />
            <CommunityFeedView />
        </PageContainer>
    );
};

export default CommunityFeedPage;
