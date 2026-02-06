import { FC, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Activity, MessageSquare, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import Button from '@/shared/components/ui/Button';
import Navbar from '@/shared/components/common/Navbar';
import Footer from '@/shared/components/common/Footer';
import { projectService } from '@/shared/services/project.service';
import type { Project } from '@/shared/types/project';
import { toast } from 'sonner';
import { useAuth } from '@/shared/hooks/use-auth';
import { formatDistanceToNow } from 'date-fns';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/shared/components/ui/dialog';
import { ProjectFileUpload } from '../components/ProjectFileUpload';
import { ProjectFileList } from '../components/ProjectFileList';
import { ProjectActivityTimeline } from '../components/ProjectActivityTimeline';

export const ProjectDetailPage: FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [project, setProject] = useState<Project | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'files' | 'activities' | 'messages'>('overview');
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (id) {
            loadProject();
        }
    }, [id]);

    const loadProject = async () => {
        if (!id) return;

        try {
            setLoading(true);
            const data = await projectService.getProjectById(id);
            setProject(data);
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || 'Failed to load project';
            toast.error(errorMessage);
            navigate('/profile/projects');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkComplete = async () => {
        if (!id) return;
        setProcessing(true);
        try {
            await projectService.markProjectComplete(id);
            toast.success('Project marked as complete');
            setShowCompleteModal(false);
            loadProject();
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || 'Failed to mark project complete';
            toast.error(errorMessage);
        } finally {
            setProcessing(false);
        }
    };

    const handleConfirmComplete = async () => {
        if (!id) return;
        setProcessing(true);
        try {
            await projectService.confirmProjectComplete(id);
            toast.success('Project completion confirmed');
            setShowConfirmModal(false);
            loadProject();
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || 'Failed to confirm completion';
            toast.error(errorMessage);
        } finally {
            setProcessing(false);
        }
    };

    const handleCancelProject = async () => {
        if (!id) return;
        setProcessing(true);
        try {
            await projectService.cancelProject(id);
            toast.success('Project cancelled');
            setShowCancelModal(false);
            navigate('/profile/projects');
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || 'Failed to cancel project';
            toast.error(errorMessage);
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1 container mx-auto px-4 py-8 mt-[5rem]">
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7682e8]"></div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!project) {
        return null;
    }

    const isProvider = project.provider?.user?.id === user?.id;
    const isClient = project.clientId === user?.id;
    const canMarkComplete = isProvider && project.status === 'IN_PROGRESS';
    const canConfirmComplete = isClient && (project.status === 'AWAITING_CLIENT_REVIEW' || project.status === 'AWAITING_REVIEW');
    const canCancel = isClient && (project.status === 'IN_PROGRESS' || project.status === 'AWAITING_CLIENT_REVIEW' || project.status === 'AWAITING_REVIEW');

    const statusConfig = {
        IN_PROGRESS: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', label: 'In Progress' },
        AWAITING_REVIEW: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', label: 'Awaiting Review' },
        AWAITING_CLIENT_REVIEW: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', label: 'Awaiting Review' },
        COMPLETED: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', label: 'Completed' },
        CANCELLED: { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', label: 'Cancelled' },
    };

    const currentStatus = statusConfig[project.status as keyof typeof statusConfig];

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl mt-[5rem]">
                <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>

                {/* Project Header */}
                <Card className="mb-6">
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                    {project.request?.title || 'Project'}
                                </CardTitle>
                                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                    <span className={`px-3 py-1 rounded-full ${currentStatus.color}`}>
                                        {currentStatus.label}
                                    </span>
                                    <span>Created {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                {canMarkComplete && (
                                    <Button
                                        onClick={() => setShowCompleteModal(true)}
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Mark Complete
                                    </Button>
                                )}
                                {canConfirmComplete && (
                                    <Button
                                        onClick={() => setShowConfirmModal(true)}
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Confirm Completion
                                    </Button>
                                )}
                                {canCancel && (
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowCancelModal(true)}
                                        className="text-red-600 hover:text-red-700 border-red-300"
                                    >
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Cancel Project
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Tabs */}
                <div className="flex items-center gap-6 border-b border-gray-200 dark:border-gray-700 mb-8">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`pb-4 text-sm font-medium transition-all relative ${activeTab === 'overview' ? 'text-[#7682e8]' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Overview
                        {activeTab === 'overview' && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#7682e8] rounded-t-full" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('files')}
                        className={`pb-4 text-sm font-medium transition-all relative ${activeTab === 'files' ? 'text-[#7682e8]' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <FileText className="w-4 h-4 inline mr-2" />
                        Files
                        {activeTab === 'files' && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#7682e8] rounded-t-full" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('activities')}
                        className={`pb-4 text-sm font-medium transition-all relative ${activeTab === 'activities' ? 'text-[#7682e8]' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Activity className="w-4 h-4 inline mr-2" />
                        Activities
                        {activeTab === 'activities' && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#7682e8] rounded-t-full" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('messages')}
                        className={`pb-4 text-sm font-medium transition-all relative ${activeTab === 'messages' ? 'text-[#7682e8]' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <MessageSquare className="w-4 h-4 inline mr-2" />
                        Messages
                        {activeTab === 'messages' && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#7682e8] rounded-t-full" />
                        )}
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</h3>
                                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                        {project.request?.description || 'No description'}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {project.request?.budgetType && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Budget</h3>
                                            <p className="text-gray-700 dark:text-gray-300">
                                                {project.request.budgetType}: ${project.request.fromBudget} - ${project.request.toBudget} {project.request.budgetCurrency}
                                            </p>
                                        </div>
                                    )}
                                    {project.request?.deadline && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Deadline</h3>
                                            <p className="text-gray-700 dark:text-gray-300">
                                                {new Date(project.request.deadline).toLocaleDateString()}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Participants</h3>
                                    <div className="space-y-2">
                                        <p className="text-gray-700 dark:text-gray-300">
                                            <span className="font-medium">Provider:</span> {project.provider?.user?.firstName} {project.provider?.user?.lastName}
                                        </p>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            <span className="font-medium">Client:</span> {project.client?.firstName} {project.client?.lastName}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {activeTab === 'files' && (
                    <div className="space-y-6">
                        <ProjectFileUpload projectId={id!} onUploadSuccess={loadProject} />
                        <ProjectFileList projectId={id!} onFileDeleted={loadProject} />
                    </div>
                )}

                {activeTab === 'activities' && (
                    <ProjectActivityTimeline projectId={id!} />
                )}

                {activeTab === 'messages' && (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center py-12">
                                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                    Messages
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    Communicate with your {isProvider ? 'client' : 'provider'} about this project
                                </p>
                                <Button onClick={() => navigate('/messages')} className="bg-[#7682e8] text-white">
                                    Go to Messages
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Mark Complete Modal */}
                <Dialog open={showCompleteModal} onOpenChange={setShowCompleteModal}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Mark Project as Complete</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to mark this project as complete? The client will be notified to review and confirm.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowCompleteModal(false)} disabled={processing}>
                                Cancel
                            </Button>
                            <Button onClick={handleMarkComplete} disabled={processing} className="bg-green-600 hover:bg-green-700 text-white">
                                {processing ? 'Processing...' : 'Yes, Mark Complete'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Confirm Complete Modal */}
                <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Confirm Project Completion</DialogTitle>
                            <DialogDescription>
                                Are you satisfied with the work? Confirm completion to finalize the project.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowConfirmModal(false)} disabled={processing}>
                                Cancel
                            </Button>
                            <Button onClick={handleConfirmComplete} disabled={processing} className="bg-green-600 hover:bg-green-700 text-white">
                                {processing ? 'Processing...' : 'Yes, Confirm'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Cancel Project Modal */}
                <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                    <AlertTriangle className="h-6 w-6 text-red-600" />
                                </div>
                                <DialogTitle className="text-xl">Cancel Project</DialogTitle>
                            </div>
                            <DialogDescription>
                                Are you sure you want to cancel this project? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowCancelModal(false)} disabled={processing}>
                                No, Keep Project
                            </Button>
                            <Button onClick={handleCancelProject} disabled={processing} className="bg-red-600 hover:bg-red-700 text-white">
                                {processing ? 'Cancelling...' : 'Yes, Cancel Project'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </main>
            <Footer />
        </div >
    );
};
