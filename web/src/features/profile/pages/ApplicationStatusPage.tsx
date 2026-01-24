import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Clock, CheckCircle, XCircle, RefreshCw, FileText, Calendar, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { profileService } from '@/shared/services';
import { useAuth } from '@/shared/hooks/use-auth';
import type { ProviderApplication } from '@/shared/types/profile';
import { ApplicationStatusTag } from '@/shared/components/common/tags';
import Button from '@/shared/components/ui/Button';

const ApplicationStatusPage: FC = () => {
    const navigate = useNavigate();
    const { refreshUser } = useAuth();
    const [applications, setApplications] = useState<ProviderApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [reapplying, setReapplying] = useState(false);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const apps = await profileService.getMyApplications();
            // Sort by date descending (newest first)
            const sorted = apps.sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setApplications(sorted);
        } catch (error) {
            console.error('Failed to fetch applications:', error);
            toast.error('Failed to load application status');
        } finally {
            setLoading(false);
        }
    };

    const handleReapply = async () => {
        setReapplying(true);
        try {
            await profileService.submitApplication();
            toast.success('Application submitted successfully!');
            await fetchApplications();
            if (refreshUser) {
                await refreshUser();
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } }; message?: string };
            const message = err.response?.data?.message || err.message || 'Failed to submit application';
            toast.error(message);
        } finally {
            setReapplying(false);
        }
    };

    const getLatestApplication = () => applications[0] || null;

    const calculateCooldownDays = (cooldownEndsAt?: string) => {
        if (!cooldownEndsAt) return 0;
        const endDate = new Date(cooldownEndsAt);
        const now = new Date();
        const diffTime = endDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(0, diffDays);
    };



    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#768de8]" />
            </div>
        );
    }

    const latestApp = getLatestApplication();
    const cooldownDays = latestApp?.cooldownEndsAt ? calculateCooldownDays(latestApp.cooldownEndsAt) : 0;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Provider Application Status</h1>
                    <p className="text-gray-600">Track the status of your provider application</p>
                </div>

                {/* No Applications */}
                {applications.length === 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <FileText className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
                        <p className="text-gray-500 mb-6">
                            You haven't submitted a provider application yet.
                        </p>
                        <Button
                            onClick={() => navigate('/provider-application')}
                            className="bg-[#768de8] hover:bg-[#5a6fd6]"
                        >
                            Start Application
                        </Button>
                    </div>
                )}

                {/* Latest Application Card */}
                {latestApp && (
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
                        {/* Status Banner */}
                        <div className={`p-6 ${latestApp.status === 'APPROVED' ? 'bg-green-50 border-b border-green-200' :
                            latestApp.status === 'REJECTED' ? 'bg-red-50 border-b border-red-200' :
                                'bg-yellow-50 border-b border-yellow-200'
                            }`}>
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${latestApp.status === 'APPROVED' ? 'bg-green-100' :
                                        latestApp.status === 'REJECTED' ? 'bg-red-100' :
                                            'bg-yellow-100'
                                        }`}>
                                        {latestApp.status === 'APPROVED' && <CheckCircle className="w-6 h-6 text-green-600" />}
                                        {latestApp.status === 'REJECTED' && <XCircle className="w-6 h-6 text-red-600" />}
                                        {latestApp.status === 'PENDING' && <Clock className="w-6 h-6 text-yellow-600" />}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            {latestApp.status === 'APPROVED' && 'Application Approved'}
                                            {latestApp.status === 'REJECTED' && 'Application Rejected'}
                                            {latestApp.status === 'PENDING' && 'Application Under Review'}
                                        </h2>
                                        <p className="text-sm text-gray-600">
                                            Submitted on {formatDate(latestApp.createdAt)}
                                        </p>
                                    </div>
                                </div>
                                <ApplicationStatusTag status={latestApp.status} />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {/* Pending Message */}
                            {latestApp.status === 'PENDING' && (
                                <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                    <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                                    <div>
                                        <h4 className="font-medium text-yellow-800">Under Review</h4>
                                        <p className="text-sm text-yellow-700 mt-1">
                                            Our team is reviewing your application. This usually takes 1-3 business days.
                                            We'll notify you once a decision has been made.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Approved Message */}
                            {latestApp.status === 'APPROVED' && (
                                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                    <div>
                                        <h4 className="font-medium text-green-800">Congratulations!</h4>
                                        <p className="text-sm text-green-700 mt-1">
                                            Your provider application has been approved. You can now start accepting
                                            projects and providing services to clients.
                                        </p>
                                        <Button
                                            onClick={() => navigate('/profile')}
                                            className="mt-4 bg-green-600 hover:bg-green-700"
                                        >
                                            Go to Profile
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Rejected Message */}
                            {latestApp.status === 'REJECTED' && (
                                <>
                                    {/* Rejection Reason */}
                                    {latestApp.reviews && latestApp.reviews.length > 0 && (
                                        <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200 mb-4">
                                            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                                            <div>
                                                <h4 className="font-medium text-red-800">Rejection Reason</h4>
                                                <p className="text-sm text-red-700 mt-1">
                                                    {latestApp.reviews[0]?.reason || 'No specific reason provided.'}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Cooldown Status */}
                                    {cooldownDays > 0 ? (
                                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <Calendar className="w-5 h-5 text-gray-600 mt-0.5" />
                                            <div>
                                                <h4 className="font-medium text-gray-800">Cooldown Period</h4>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    You can reapply in <strong>{cooldownDays} day{cooldownDays !== 1 ? 's' : ''}</strong>.
                                                    Use this time to improve your profile based on the feedback above.
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                            <RefreshCw className="w-5 h-5 text-blue-600 mt-0.5" />
                                            <div>
                                                <h4 className="font-medium text-blue-800">Ready to Reapply</h4>
                                                <p className="text-sm text-blue-700 mt-1">
                                                    Your cooldown period has ended. You can now update your profile and submit a new application.
                                                </p>
                                                <div className="flex gap-3 mt-4">
                                                    <Button
                                                        onClick={() => navigate('/profile')}
                                                        variant="outline"
                                                    >
                                                        Edit Profile
                                                    </Button>
                                                    <Button
                                                        onClick={handleReapply}
                                                        disabled={reapplying}
                                                        className="bg-[#768de8] hover:bg-[#5a6fd6]"
                                                    >
                                                        {reapplying ? (
                                                            <>
                                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                                Submitting...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <RefreshCw className="w-4 h-4 mr-2" />
                                                                Reapply Now
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Application History */}
                {applications.length > 1 && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Application History</h3>
                        <div className="space-y-3">
                            {applications.slice(1).map((app) => (
                                <div key={app.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${app.status === 'APPROVED' ? 'bg-green-100' :
                                            app.status === 'REJECTED' ? 'bg-red-100' :
                                                'bg-yellow-100'
                                            }`}>
                                            {app.status === 'APPROVED' && <CheckCircle className="w-4 h-4 text-green-600" />}
                                            {app.status === 'REJECTED' && <XCircle className="w-4 h-4 text-red-600" />}
                                            {app.status === 'PENDING' && <Clock className="w-4 h-4 text-yellow-600" />}
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-500">
                                                {formatDate(app.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                    <ApplicationStatusTag status={app.status} size="sm" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApplicationStatusPage;
