import { Flag, User, Calendar, AlertTriangle } from 'lucide-react';
import { LoadingSpinner } from '../common';
import { useReportDetails } from '../../api/hooks/useModeration';
import ModerationActionButtons from './ModerationActionButtons';

interface ReportDetailsViewProps {
    reportId: number;
}

const ReportDetailsView: React.FC<ReportDetailsViewProps> = ({ reportId }) => {
    const { data: report, isLoading, error } = useReportDetails(reportId);

    if (isLoading) {
        return <LoadingSpinner text="Loading report details..." />;
    }

    if (error || !report) {
        return <div className="text-center py-8 text-red-500">Failed to load report details</div>;
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-red-50">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                            <Flag className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-xl font-bold text-gray-900">Report #{report.reportId}</h1>
                                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                                    {report.status}
                                </span>
                            </div>
                            <p className="text-gray-600">
                                {report.contentType} {report.contentId ? `#${report.contentId}` : ''}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                            <AlertTriangle className="w-5 h-5 text-amber-500" />
                            Report Information
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-500">Reason</p>
                                <p className="font-medium text-gray-900">{report.reason}</p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-500">Content Type</p>
                                <p className="font-medium text-gray-900">{report.contentType}</p>
                            </div>

                            {report.details && (
                                <div className="bg-gray-50 rounded-lg p-4 col-span-2">
                                    <p className="text-sm text-gray-500">Details</p>
                                    <p className="text-gray-900">{report.details}</p>
                                </div>
                            )}

                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <User className="w-4 h-4" /> Reported By
                                </p>
                                <p className="font-medium text-gray-900">User #{report.reporterId}</p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <Calendar className="w-4 h-4" /> Reported At
                                </p>
                                <p className="font-medium text-gray-900">
                                    {new Date(report.createdAt).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {report.contentId && (
                    <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                        <ModerationActionButtons reportId={reportId} contentType={report.contentType} contentId={report.contentId} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportDetailsView;
