import { FC } from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import type { ProviderApplication } from '@/shared/types/profile';
import { ApplicationStatusTag } from '@/shared/components/common/tags';

interface ApplicationStatusCardProps {
    application: ProviderApplication;
    showDetails?: boolean;
}

export const ApplicationStatusCard: FC<ApplicationStatusCardProps> = ({
    application,
    showDetails = true
}) => {
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className={`p-6 rounded-lg border flex items-start justify-between ${application.status === 'APPROVED' ? 'bg-green-50 border-green-200' :
                application.status === 'REJECTED' ? 'bg-red-50 border-red-200' :
                    'bg-yellow-50 border-yellow-200'
            }`}>
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${application.status === 'APPROVED' ? 'bg-green-100' :
                        application.status === 'REJECTED' ? 'bg-red-100' :
                            'bg-yellow-100'
                    }`}>
                    {application.status === 'APPROVED' && <CheckCircle className="w-6 h-6 text-green-600" />}
                    {application.status === 'REJECTED' && <XCircle className="w-6 h-6 text-red-600" />}
                    {application.status === 'PENDING' && <Clock className="w-6 h-6 text-yellow-600" />}
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                        {application.status === 'APPROVED' && 'Application Approved'}
                        {application.status === 'REJECTED' && 'Application Rejected'}
                        {application.status === 'PENDING' && 'Application Under Review'}
                    </h2>
                    {showDetails && (
                        <p className="text-sm text-gray-600">
                            Submitted on {formatDate(application.createdAt)}
                        </p>
                    )}
                </div>
            </div>
            <ApplicationStatusTag status={application.status} />
        </div>
    );
};
