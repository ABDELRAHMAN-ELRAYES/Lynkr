import { FC } from 'react';
import { DollarSign, Clock, User, FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/shared/components/ui/card';
import { ProposalStatusTag } from '@/shared/components/common/tags';
import Button from '@/shared/components/ui/Button';
import type { Proposal } from '@/shared/types/request';
import { formatDistanceToNow } from 'date-fns';

interface ProposalCardProps {
    proposal: Proposal;
    viewType?: 'client' | 'provider';
    onAccept?: (id: string) => void;
    onReject?: (id: string) => void;
    onWithdraw?: (id: string) => void;
    showActions?: boolean;
}

export const ProposalCard: FC<ProposalCardProps> = ({
    proposal,
    viewType = 'client',
    onAccept,
    onReject,
    onWithdraw,
    showActions = true,
}) => {
    const canAccept = viewType === 'client' && proposal.status === 'PENDING';
    const canReject = viewType === 'client' && proposal.status === 'PENDING';
    const canWithdraw = viewType === 'provider' && proposal.status === 'PENDING';

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            {proposal.provider?.user && (
                                <>
                                    <User className="h-5 w-5" />
                                    <span>
                                        {proposal.provider.user.firstName} {proposal.provider.user.lastName}
                                    </span>
                                </>
                            )}
                        </CardTitle>
                        {proposal.provider?.title && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {proposal.provider.title}
                            </p>
                        )}
                    </div>
                    <ProposalStatusTag status={proposal.status} />
                </div>
            </CardHeader>

            <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1.5">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-medium">Price:</span>
                        <span>
                            ${proposal.price} {proposal.priceType === 'HOURLY' ? '/hour' : 'fixed'}
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">Delivery:</span>
                        <span>{proposal.estimatedDays} days</span>
                    </div>
                </div>

                {proposal.notes && (
                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-start gap-2">
                            <FileText className="h-4 w-4 mt-0.5 text-gray-500" />
                            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                {proposal.notes}
                            </p>
                        </div>
                    </div>
                )}

                {proposal.files && proposal.files.length > 0 && (
                    <div className="mt-3">
                        <p className="text-xs font-medium text-gray-500 mb-2">Attachments ({proposal.files.length})</p>
                        <div className="flex flex-wrap gap-2">
                            {proposal.files.map((file) => (
                                <a
                                    key={file.id}
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    {file.filename}
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>

            {showActions && (
                <CardFooter className="flex items-center justify-between gap-4 pt-4 border-t">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        Submitted {formatDistanceToNow(new Date(proposal.createdAt), { addSuffix: true })}
                    </div>
                    <div className="flex gap-2">
                        {canWithdraw && onWithdraw && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onWithdraw(proposal.id)}
                            >
                                Withdraw
                            </Button>
                        )}
                        {canReject && onReject && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onReject(proposal.id)}
                            >
                                Reject
                            </Button>
                        )}
                        {canAccept && onAccept && (
                            <Button
                                variant="default"
                                size="sm"
                                onClick={() => onAccept(proposal.id)}
                            >
                                Accept
                            </Button>
                        )}
                    </div>
                </CardFooter>
            )}
        </Card>
    );
};
