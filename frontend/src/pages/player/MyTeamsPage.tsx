import React from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { PageContainer, PageHeader } from '../../components/common';
import { MyTeamsList } from '../../components/player';
import { useAuth } from '../../contexts';

const MyTeamsPage: React.FC = () => {
    const { user } = useAuth();
    const playerId = user?.userId || 0;

    return (
        <PageContainer maxWidth="md">
            <PageHeader
                title="My Teams"
                subtitle="Teams you are a member of."
                action={
                    <Link
                        to="/search/teams"
                        className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                    >
                        <Search className="w-5 h-5 mr-2" />
                        Find Teams
                    </Link>
                }
            />
            <MyTeamsList playerId={playerId} />
        </PageContainer>
    );
};

export default MyTeamsPage;
