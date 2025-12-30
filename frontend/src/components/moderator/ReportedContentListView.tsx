import { Flag, Eye, AlertTriangle } from 'lucide-react';
import { LoadingSpinner, EmptyState, Button } from '../common';
import { usePendingReports } from '../../api/hooks/useModeration';
import type { Report } from '../../types';
import { Link } from 'react-router-dom';

const ReportedContentListView: React.FC = () => {
    const { data: reports, isLoading, error } = usePendingReports();

    if (isLoading) {
        return <LoadingSpinner text="Loading reports..." />;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">Failed to load reports</div>;
    }

    if (!reports || reports.length === 0) {
        return (
            <EmptyState
                title="No Pending Reports"
                description="All reports have been reviewed. The community thanks you! 🙏"
            />
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <Flag className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Reported Content</h2>
                        <p className="text-sm text-gray-500">Review and moderate reported content</p>
                    </div>
                </div>
                <span className="bg-red-100 text-red-700 text-sm px-3 py-1 rounded-full">
                    {reports.length} pending
                </span>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Type</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Reason</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Reporter</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {reports.map((report: Report) => (
                            <tr key={report.reportId} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                                        <span className="text-sm font-medium text-gray-900">
                                            {report.contentType}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">{report.reason}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">User #{report.reporterId}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                    {new Date(report.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <Link to={`/moderator/reports/${report.reportId}`}>
                                        <Button size="sm" variant="ghost" leftIcon={<Eye className="w-4 h-4" />}>
                                            Review
                                        </Button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReportedContentListView;
