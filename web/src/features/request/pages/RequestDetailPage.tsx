import { FC, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, DollarSign, Clock, User, FileText, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { RequestStatusTag } from '@/shared/components/common/tags';
import { ProposalCard } from '../components/ProposalCard';
import { ProposalForm } from '../components/ProposalForm';
import { requestService } from '@/shared/services/request.service';
import { proposalService } from '@/shared/services/proposal.service';
import type { Request, Proposal } from '@/shared/types/request';
import { toast } from 'sonner';
import Navbar from '@/shared/components/common/Navbar';
import Footer from '@/shared/components/common/Footer';
import Button from '@/shared/components/ui/Button';
import { useAuth } from '@/shared/hooks/use-auth';
import { formatDistanceToNow } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/shared/components/ui/dialog';

export const RequestDetailPage: FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [request, setRequest] = useState<Request | null>(null);
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [showProposalForm, setShowProposalForm] = useState(false);
    const [loadingProposals, setLoadingProposals] = useState(false);
    const [showAcceptModal, setShowAcceptModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [processingAction, setProcessingAction] = useState(false);

    const isClient = user?.role === 'CLIENT';
    const isProvider = user?.role?.startsWith('PROVIDER');

    useEffect(() => {
        if (id) {
            loadRequest();
            if (isClient) {
                loadProposals();
            }
        }
    }, [id, isClient]);

    const loadRequest = async () => {
        if (!id) return;
        try {
            setLoading(true);
            const data = await requestService.getRequestById(id);
            setRequest(data);
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || 'Failed to load request';
            toast.error(errorMessage);
            navigate('/requests');
        } finally {
            setLoading(false);
        }
    };

    const loadProposals = async () => {
        if (!id) return;
        try {
            setLoadingProposals(true);
            const data = await proposalService.getProposalsByRequest(id);
            setProposals(data);
        } catch (error: any) {
            console.error('Failed to load proposals:', error);
        } finally {
            setLoadingProposals(false);
        }
    };

    const handleAcceptProposal = async (proposalId: string) => {
        if (!window.confirm('Are you sure you want to accept this proposal? This will reject all other proposals.')) {
            return;
        }

        try {
            await proposalService.acceptProposal(proposalId);
            toast.success('Proposal accepted successfully');
            loadRequest();
            loadProposals();
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || 'Failed to accept proposal';
            toast.error(errorMessage);
        }
    };

    const handleRejectProposal = async (proposalId: string) => {
        if (!window.confirm('Are you sure you want to reject this proposal?')) {
            return;
        }

        try {
            await proposalService.rejectProposal(proposalId);
            toast.success('Proposal rejected');
            loadProposals();
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || 'Failed to reject proposal';
            toast.error(errorMessage);
        }
    };

    const handleCancelRequest = async () => {
        if (!window.confirm('Are you sure you want to cancel this request?')) {
            return;
        }

        try {
            await requestService.cancelRequest(id!);
            toast.success('Request cancelled successfully');
            navigate('/requests');
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || 'Failed to cancel request';
            toast.error(errorMessage);
        }
    };

    const handleProposalSubmit = () => {
        setShowProposalForm(false);
        loadProposals();
        loadRequest();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
                <Navbar />
                <main className="flex-1 container mx-auto px-4 py-8">
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7682e8]"></div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!request) {
        return null;
    }

    const canSubmitProposal = isProvider &&
        (request.status === 'PENDING' || request.status === 'PUBLIC') &&
        !proposals.some((p) => p.status === 'PENDING' || p.status === 'ACCEPTED');

    const canCancel = isClient &&
        (request.status === 'DRAFT' || request.status === 'PENDING' || request.status === 'PUBLIC');

    const canAcceptReject = isProvider &&
        request.status === 'PENDING' &&
        request.targetProviderId; // Only for direct requests

    const handleAcceptRequest = async () => {
        if (!id) return;
        setProcessingAction(true);
        try {
            await requestService.acceptRequest(id);
            toast.success('Request accepted successfully');
            setShowAcceptModal(false);
            loadRequest();
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || 'Failed to accept request';
            toast.error(errorMessage);
        } finally {
            setProcessingAction(false);
        }
    };

    const handleRejectRequest = async () => {
        if (!id) return;
        setProcessingAction(true);
        try {
            await requestService.rejectRequest(id);
            toast.success('Request rejected successfully');
            setShowRejectModal(false);
            loadRequest();
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || 'Failed to reject request';
            toast.error(errorMessage);
        } finally {
            setProcessingAction(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col dark:bg-gray-900 mt-[5rem]">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="mb-6"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>

                {/* Request Details */}
                <Card className="mb-6">
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {request.title}
                                </CardTitle>
                                <div className="mt-2 flex items-center gap-2">
                                    <RequestStatusTag status={request.status} />
                                    {request.ndaRequired && (
                                        <span className="text-xs px-2 py-1 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded">
                                            NDA Required
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Description
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                {request.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-2 text-sm">
                                <span className="font-semibold text-gray-700 dark:text-gray-300">Category:</span>
                                <span className="text-gray-600 dark:text-gray-400">{request.category}</span>
                            </div>

                            {request.budgetType && (
                                <div className="flex items-center gap-2 text-sm">
                                    <DollarSign className="h-4 w-4 text-gray-500" />
                                    <span className="font-semibold text-gray-700 dark:text-gray-300">Budget:</span>
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {request.budgetType}
                                        {request.fromBudget && request.toBudget && (
                                            <span className="ml-1">
                                                ${request.fromBudget} - ${request.toBudget} {request.budgetCurrency}
                                            </span>
                                        )}
                                        {request.fromBudget && !request.toBudget && (
                                            <span className="ml-1">
                                                ${request.fromBudget}+ {request.budgetCurrency}
                                            </span>
                                        )}
                                    </span>
                                </div>
                            )}

                            {request.deadline && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <span className="font-semibold text-gray-700 dark:text-gray-300">Deadline:</span>
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {new Date(request.deadline).toLocaleString()}
                                    </span>
                                </div>
                            )}

                            {request.responseDeadline && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Clock className="h-4 w-4 text-gray-500" />
                                    <span className="font-semibold text-gray-700 dark:text-gray-300">Response by:</span>
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {formatDistanceToNow(new Date(request.responseDeadline), { addSuffix: true })}
                                    </span>
                                </div>
                            )}

                            {request.targetProvider && (
                                <div className="flex items-center gap-2 text-sm">
                                    <User className="h-4 w-4 text-gray-500" />
                                    <span className="font-semibold text-gray-700 dark:text-gray-300">Direct to:</span>
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {request.targetProvider.user?.firstName} {request.targetProvider.user?.lastName}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Auto-publish Indicator for pending direct requests */}
                        {request.status === 'PENDING' &&
                            request.targetProviderId &&
                            request.enableAutoPublish &&
                            request.responseDeadline && (
                                <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                                    <div className="text-sm">
                                        <span className="font-medium text-amber-800 dark:text-amber-200">
                                            Auto-publish enabled:
                                        </span>
                                        <span className="text-amber-700 dark:text-amber-300 ml-1">
                                            This request will become public {formatDistanceToNow(new Date(request.responseDeadline), { addSuffix: true })} if no response is received.
                                        </span>
                                    </div>
                                </div>
                            )}

                        {request.files && request.files.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Attachments
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {request.files.map((file) => (
                                        <a
                                            key={file.id}
                                            href={file.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                                        >
                                            <FileText className="h-4 w-4" />
                                            <span className="text-sm">{file.filename}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t border-gray-300">
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                Created {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                            </div>
                            <div className="flex gap-2">
                                {canAcceptReject && (
                                    <>
                                        <Button
                                            variant="outline"
                                            onClick={() => setShowRejectModal(true)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300"
                                        >
                                            <XCircle className="h-4 w-4 mr-2" />
                                            Reject Request
                                        </Button>
                                        <Button
                                            variant="default"
                                            onClick={() => setShowAcceptModal(true)}
                                            className="bg-green-600 hover:bg-green-700 text-white"
                                        >
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Accept Request
                                        </Button>
                                    </>
                                )}
                                {canCancel && (
                                    <Button
                                        variant="outline"
                                        onClick={handleCancelRequest}
                                    >
                                        Cancel Request
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>


                {/* Proposals Section - Enhanced for Clients */}
                {isClient && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Proposals ({proposals.length})</span>
                            </CardTitle>
                            {/* Proposal Summary Stats */}
                            {proposals.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                        {proposals.filter(p => p.status === 'PENDING').length} Pending
                                    </span>
                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                        {proposals.filter(p => p.status === 'ACCEPTED').length} Accepted
                                    </span>
                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                        {proposals.filter(p => p.status === 'REJECTED').length} Rejected
                                    </span>
                                </div>
                            )}
                        </CardHeader>
                        <CardContent>
                            {loadingProposals ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7682e8]"></div>
                                </div>
                            ) : proposals.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                        <User className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                        No proposals yet
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                                        {request.isPublic
                                            ? 'Providers matching your category will submit proposals soon.'
                                            : 'Waiting for the provider to respond to your request.'}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Comparison Guide */}
                                    {proposals.filter(p => p.status === 'PENDING').length > 1 && (
                                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-blue-800 dark:text-blue-200">
                                            <strong>Tip:</strong> Compare proposals by price, delivery time, and provider ratings before making a decision.
                                        </div>
                                    )}

                                    {/* Pending Proposals First */}
                                    {proposals.filter(p => p.status === 'PENDING').length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                                                Pending Review
                                            </h4>
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                {proposals.filter(p => p.status === 'PENDING').map((proposal) => (
                                                    <ProposalCard
                                                        key={proposal.id}
                                                        proposal={proposal}
                                                        viewType="client"
                                                        onAccept={handleAcceptProposal}
                                                        onReject={handleRejectProposal}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Accepted Proposals */}
                                    {proposals.filter(p => p.status === 'ACCEPTED').length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                                Accepted
                                            </h4>
                                            <div className="space-y-4">
                                                {proposals.filter(p => p.status === 'ACCEPTED').map((proposal) => (
                                                    <ProposalCard
                                                        key={proposal.id}
                                                        proposal={proposal}
                                                        viewType="client"
                                                        showActions={false}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Rejected Proposals */}
                                    {proposals.filter(p => p.status === 'REJECTED').length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                                Rejected
                                            </h4>
                                            <div className="opacity-60">
                                                <div className="space-y-4">
                                                    {proposals.filter(p => p.status === 'REJECTED').map((proposal) => (
                                                        <ProposalCard
                                                            key={proposal.id}
                                                            proposal={proposal}
                                                            viewType="client"
                                                            showActions={false}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Provider Proposal Section */}
                {isProvider && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>{showProposalForm ? 'Submit Proposal' : 'Your Proposal'}</span>
                                {proposals.length > 0 && !showProposalForm && (
                                    <div className={`px-3 py-1 text-xs font-medium rounded-full ${proposals[0]?.status === 'PENDING'
                                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                            : proposals[0]?.status === 'ACCEPTED'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                        }`}>
                                        {proposals[0]?.status}
                                    </div>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {showProposalForm ? (
                                <ProposalForm
                                    requestId={id!}
                                    onSubmit={handleProposalSubmit}
                                    onCancel={() => setShowProposalForm(false)}
                                />
                            ) : canSubmitProposal ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                        <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                        Ready to submit your proposal?
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                                        Review the request details above and submit your proposal with your price and delivery timeline.
                                    </p>
                                    <Button onClick={() => setShowProposalForm(true)} className="bg-[#7682e8] text-white">
                                        Submit Proposal
                                    </Button>
                                </div>
                            ) : proposals.length > 0 ? (
                                <div className="space-y-4">
                                    {/* Status-specific messaging */}
                                    {proposals[0]?.status === 'PENDING' && (
                                        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-sm text-yellow-800 dark:text-yellow-200">
                                            <strong>Awaiting response:</strong> The client is reviewing your proposal. You'll be notified when they respond.
                                        </div>
                                    )}
                                    {proposals[0]?.status === 'ACCEPTED' && (
                                        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-800 dark:text-green-200">
                                            <strong>Congratulations!</strong> Your proposal was accepted. A project has been created and you can start working.
                                        </div>
                                    )}
                                    {proposals[0]?.status === 'REJECTED' && (
                                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-800 dark:text-red-200">
                                            <strong>Not selected:</strong> Unfortunately, the client chose another provider for this project.
                                        </div>
                                    )}

                                    {/* Proposal Details */}
                                    {proposals.map((proposal) => (
                                        <ProposalCard
                                            key={proposal.id}
                                            proposal={proposal}
                                            viewType="provider"
                                            showActions={false}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                        <AlertTriangle className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                        No longer accepting proposals
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                                        {request.status === 'ACCEPTED'
                                            ? 'This request has already been accepted by another provider.'
                                            : request.status === 'CANCELLED'
                                                ? 'The client has cancelled this request.'
                                                : 'This request has expired and is no longer open for proposals.'}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Accept Request Confirmation Modal */}
                <Dialog open={showAcceptModal} onOpenChange={setShowAcceptModal}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                </div>
                                <DialogTitle className="text-xl">Accept Request</DialogTitle>
                            </div>
                            <DialogDescription className="text-base">
                                Are you sure you want to accept this request?
                            </DialogDescription>
                        </DialogHeader>
                        <div className="my-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                                <div className="text-sm text-amber-800">
                                    <p className="font-semibold mb-1">Please confirm:</p>
                                    <ul className="list-disc list-inside space-y-1 text-amber-700">
                                        <li>You understand the project requirements</li>
                                        <li>You can deliver within the specified deadline</li>
                                        <li>You agree to the budget and terms</li>
                                        <li>This action cannot be undone</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setShowAcceptModal(false)}
                                disabled={processingAction}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleAcceptRequest}
                                disabled={processingAction}
                                className="bg-green-600 hover:bg-green-700 text-white"
                            >
                                {processingAction ? 'Processing...' : 'Yes, Accept Request'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Reject Request Confirmation Modal */}
                <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                    <XCircle className="h-6 w-6 text-red-600" />
                                </div>
                                <DialogTitle className="text-xl">Reject Request</DialogTitle>
                            </div>
                            <DialogDescription className="text-base">
                                Are you sure you want to reject this request?
                            </DialogDescription>
                        </DialogHeader>
                        <div className="my-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                                <div className="text-sm text-red-800">
                                    <p className="font-semibold mb-1">Warning:</p>
                                    <ul className="list-disc list-inside space-y-1 text-red-700">
                                        <li>The client will be notified of your rejection</li>
                                        <li>This action cannot be undone</li>
                                        <li>You will not be able to accept this request later</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setShowRejectModal(false)}
                                disabled={processingAction}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleRejectRequest}
                                disabled={processingAction}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                {processingAction ? 'Processing...' : 'Yes, Reject Request'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </main>
            <Footer />
        </div>
    );
};
