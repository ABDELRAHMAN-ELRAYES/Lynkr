import { FC, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, DollarSign, Clock, User, FileText, AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';
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
            <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
                <Navbar />
                <main className="flex-1 container mx-auto px-4 py-8">
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-gray-900 dark:border-gray-800 dark:border-t-gray-100"></div>
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
        request.targetProviderId;

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
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 mt-[5rem]">
            <Navbar />
            <main className="flex-1 container mx-auto px-6 py-12 max-w-[90rem]">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-8 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </button>

                {/* Request Header */}
                <div className="mb-12">
                    <div className="flex items-start justify-between gap-6 mb-6">
                        <div className="flex-1">
                            <h1 className="text-3xl font-light text-gray-900 dark:text-gray-50 mb-3 tracking-tight">
                                {request.title}
                            </h1>
                            <div className="flex items-center gap-3">
                                <RequestStatusTag status={request.status} />
                                {request.ndaRequired && (
                                    <span className="text-xs px-2.5 py-1 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded">
                                        NDA Required
                                    </span>
                                )}
                            </div>
                        </div>
                        {(canAcceptReject || canCancel) && (
                            <div className="flex gap-2">
                                {canAcceptReject && (
                                    <>
                                        <Button
                                            variant="outline"
                                            onClick={() => setShowRejectModal(true)}
                                            className="border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                                        >
                                            Reject
                                        </Button>
                                        <Button
                                            onClick={() => setShowAcceptModal(true)}
                                            className="bg-gray-900 dark:bg-gray-50 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200"
                                        >
                                            Accept Request
                                        </Button>
                                    </>
                                )}
                                {canCancel && (
                                    <Button
                                        variant="outline"
                                        onClick={handleCancelRequest}
                                        className="border-gray-300 dark:border-gray-700"
                                    >
                                        Cancel Request
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {request.description}
                    </p>
                </div>

                {/* Request Details Grid */}
                <div className="grid grid-cols-2 gap-x-12 gap-y-6 pb-12 mb-12 border-b border-gray-200 dark:border-gray-800">
                    <div>
                        <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-500 mb-1">Category</div>
                        <div className="text-sm text-gray-900 dark:text-gray-100">{request.category}</div>
                    </div>

                    {request.budgetType && (
                        <div>
                            <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-500 mb-1">Budget</div>
                            <div className="text-sm text-gray-900 dark:text-gray-100">
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
                            </div>
                        </div>
                    )}

                    {request.deadline && (
                        <div>
                            <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-500 mb-1">Deadline</div>
                            <div className="text-sm text-gray-900 dark:text-gray-100">
                                {new Date(request.deadline).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </div>
                        </div>
                    )}

                    {request.responseDeadline && (
                        <div>
                            <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-500 mb-1">Response By</div>
                            <div className="text-sm text-gray-900 dark:text-gray-100">
                                {formatDistanceToNow(new Date(request.responseDeadline), { addSuffix: true })}
                            </div>
                        </div>
                    )}

                    {request.targetProvider && (
                        <div>
                            <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-500 mb-1">Direct To</div>
                            <div className="text-sm text-gray-900 dark:text-gray-100">
                                {request.targetProvider.user?.firstName} {request.targetProvider.user?.lastName}
                            </div>
                        </div>
                    )}

                    <div>
                        <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-500 mb-1">Created</div>
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                            {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                        </div>
                    </div>
                </div>

                {/* Auto-publish Notice */}
                {request.status === 'PENDING' &&
                    request.targetProviderId &&
                    request.enableAutoPublish &&
                    request.responseDeadline && (
                        <div className="flex items-start gap-3 p-4 mb-12 border border-gray-300 dark:border-gray-700 rounded">
                            <Info className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 shrink-0" />
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                This request will become public {formatDistanceToNow(new Date(request.responseDeadline), { addSuffix: true })} if no response is received.
                            </div>
                        </div>
                    )}

                {/* Attachments */}
                {request.files && request.files.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-500 mb-4">Attachments</h2>
                        <div className="flex flex-wrap gap-2">
                            {request.files.map((file) => (
                                <a
                                    key={file.id}
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                                >
                                    <FileText className="h-4 w-4" />
                                    {file.filename}
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Proposals Section - Client View */}
                {isClient && (
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-light text-gray-900 dark:text-gray-50">
                                Proposals
                                <span className="text-gray-500 dark:text-gray-500 ml-2">({proposals.length})</span>
                            </h2>
                            {proposals.length > 0 && (
                                <div className="flex gap-4 text-xs">
                                    <span className="text-gray-500 dark:text-gray-500">
                                        {proposals.filter(p => p.status === 'PENDING').length} Pending
                                    </span>
                                    <span className="text-gray-500 dark:text-gray-500">
                                        {proposals.filter(p => p.status === 'ACCEPTED').length} Accepted
                                    </span>
                                    <span className="text-gray-500 dark:text-gray-500">
                                        {proposals.filter(p => p.status === 'REJECTED').length} Rejected
                                    </span>
                                </div>
                            )}
                        </div>

                        {loadingProposals ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-gray-900 dark:border-gray-800 dark:border-t-gray-100"></div>
                            </div>
                        ) : proposals.length === 0 ? (
                            <div className="text-center py-16 border border-gray-200 dark:border-gray-800 rounded">
                                <User className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-base font-normal text-gray-900 dark:text-gray-100 mb-2">
                                    No proposals yet
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-500 max-w-md mx-auto">
                                    {request.isPublic
                                        ? 'Providers matching your category will submit proposals soon.'
                                        : 'Waiting for the provider to respond to your request.'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {proposals.filter(p => p.status === 'PENDING').length > 1 && (
                                    <div className="flex items-start gap-3 p-4 border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-700 dark:text-gray-300">
                                        <Info className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 shrink-0" />
                                        Compare proposals by price, delivery time, and provider ratings before making a decision.
                                    </div>
                                )}

                                {proposals.filter(p => p.status === 'PENDING').length > 0 && (
                                    <div>
                                        <h3 className="text-sm text-gray-500 dark:text-gray-500 mb-4">Pending Review</h3>
                                        <div className="grid grid-cols-1 gap-4">
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

                                {proposals.filter(p => p.status === 'ACCEPTED').length > 0 && (
                                    <div>
                                        <h3 className="text-sm text-gray-500 dark:text-gray-500 mb-4">Accepted</h3>
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

                                {proposals.filter(p => p.status === 'REJECTED').length > 0 && (
                                    <div className="opacity-50">
                                        <h3 className="text-sm text-gray-500 dark:text-gray-500 mb-4">Rejected</h3>
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
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Provider Proposal Section */}
                {isProvider && (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-light text-gray-900 dark:text-gray-50">
                                {showProposalForm ? 'Submit Proposal' : 'Your Proposal'}
                            </h2>
                            {proposals.length > 0 && !showProposalForm && (
                                <span className={`px-2.5 py-1 text-xs border rounded ${proposals[0]?.status === 'PENDING'
                                        ? 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                                        : proposals[0]?.status === 'ACCEPTED'
                                            ? 'border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100'
                                            : 'border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-500'
                                    }`}>
                                    {proposals[0]?.status}
                                </span>
                            )}
                        </div>

                        {showProposalForm ? (
                            <ProposalForm
                                requestId={id!}
                                onSubmit={handleProposalSubmit}
                                onCancel={() => setShowProposalForm(false)}
                            />
                        ) : canSubmitProposal ? (
                            <div className="text-center py-16 border border-gray-200 dark:border-gray-800 rounded">
                                <FileText className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-base font-normal text-gray-900 dark:text-gray-100 mb-2">
                                    Ready to submit your proposal?
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-500 mb-6 max-w-md mx-auto">
                                    Review the request details and submit your proposal with your price and delivery timeline.
                                </p>
                                <Button
                                    onClick={() => setShowProposalForm(true)}
                                    className="bg-gray-900 dark:bg-gray-50 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200"
                                >
                                    Submit Proposal
                                </Button>
                            </div>
                        ) : proposals.length > 0 ? (
                            <div className="space-y-6">
                                {proposals[0]?.status === 'PENDING' && (
                                    <div className="flex items-start gap-3 p-4 border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-700 dark:text-gray-300">
                                        <Info className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-0.5 shrink-0" />
                                        The client is reviewing your proposal. You'll be notified when they respond.
                                    </div>
                                )}
                                {proposals[0]?.status === 'ACCEPTED' && (
                                    <div className="flex items-start gap-3 p-4 border border-gray-900 dark:border-gray-100 rounded text-sm text-gray-900 dark:text-gray-100">
                                        <CheckCircle className="h-5 w-5 mt-0.5 shrink-0" />
                                        Your proposal was accepted. A project has been created and you can start working.
                                    </div>
                                )}
                                {proposals[0]?.status === 'REJECTED' && (
                                    <div className="flex items-start gap-3 p-4 border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-500 dark:text-gray-500">
                                        <XCircle className="h-5 w-5 mt-0.5 shrink-0" />
                                        The client chose another provider for this project.
                                    </div>
                                )}

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
                            <div className="text-center py-16 border border-gray-200 dark:border-gray-800 rounded">
                                <AlertTriangle className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-base font-normal text-gray-900 dark:text-gray-100 mb-2">
                                    No longer accepting proposals
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-500 max-w-md mx-auto">
                                    {request.status === 'ACCEPTED'
                                        ? 'This request has already been accepted by another provider.'
                                        : request.status === 'CANCELLED'
                                            ? 'The client has cancelled this request.'
                                            : 'This request has expired and is no longer open for proposals.'}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Accept Request Modal */}
                <Dialog open={showAcceptModal} onOpenChange={setShowAcceptModal}>
                    <DialogContent className="max-w-md border border-gray-200 dark:border-gray-800">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-light">Accept Request</DialogTitle>
                            <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                                Are you sure you want to accept this request?
                            </DialogDescription>
                        </DialogHeader>
                        <div className="my-6 p-4 border border-gray-300 dark:border-gray-700 rounded">
                            {request.fromBudget && request.toBudget && (
                                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-100 dark:border-blue-800">
                                    <p className="text-sm text-blue-800 dark:text-blue-200 mb-1 font-medium">
                                        Project Value: ${((Number(request.fromBudget) + Number(request.toBudget)) / 2).toFixed(2)}
                                    </p>
                                    <p className="text-xs text-blue-700 dark:text-blue-300">
                                        The project will be created with the average price of your budget range.
                                    </p>
                                </div>
                            )}

                            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                <li>• You understand the project requirements</li>
                                <li>• You can deliver within the specified deadline</li>
                                <li>• You agree to the budget and terms</li>
                                <li>• This action cannot be undone</li>
                            </ul>

                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Want to propose a different price? <button className="text-gray-900 dark:text-gray-100 underline" onClick={() => { setShowAcceptModal(false); setShowProposalForm(true); }}>Submit a proposal</button> instead.
                                </p>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setShowAcceptModal(false)}
                                disabled={processingAction}
                                className="border-gray-300 dark:border-gray-700"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleAcceptRequest}
                                disabled={processingAction}
                                className="bg-gray-900 dark:bg-gray-50 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200"
                            >
                                {processingAction ? 'Processing...' : 'Accept Request'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Reject Request Modal */}
                <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
                    <DialogContent className="max-w-md border border-gray-200 dark:border-gray-800">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-light">Reject Request</DialogTitle>
                            <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                                Are you sure you want to reject this request?
                            </DialogDescription>
                        </DialogHeader>
                        <div className="my-6 p-4 border border-gray-300 dark:border-gray-700 rounded">
                            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                <li>• The client will be notified of your rejection</li>
                                <li>• This action cannot be undone</li>
                                <li>• You will not be able to accept this request later</li>
                            </ul>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setShowRejectModal(false)}
                                disabled={processingAction}
                                className="border-gray-300 dark:border-gray-700"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleRejectRequest}
                                disabled={processingAction}
                                className="bg-gray-900 dark:bg-gray-50 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200"
                            >
                                {processingAction ? 'Processing...' : 'Reject Request'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </main>
            <Footer />
        </div>
    );
};