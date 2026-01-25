import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, DollarSign, Clock, User } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/shared/components/ui/card';
import { RequestStatusTag } from '@/shared/components/common/tags';
import Button from '@/shared/components/ui/Button';
import type { Request } from '@/shared/types/request';
import { formatDistanceToNow } from 'date-fns';

interface RequestCardProps {
    request: Request;
    viewType?: 'client' | 'provider';
    onCancel?: (id: string) => void;
}

export const RequestCard: FC<RequestCardProps> = ({ request, viewType = 'client', onCancel }) => {
    const navigate = useNavigate();

    const handleViewDetails = () => {
        navigate(`/requests/${request.id}`);
    };

    const canCancel = viewType === 'client' &&
        (request.status === 'DRAFT' || request.status === 'PENDING' || request.status === 'PUBLIC');

    return (
        <Card className="hover:shadow-md transition-shadow border border-gray-300">
            <CardHeader>
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                            {request.title}
                        </CardTitle>
                        <CardDescription className="mt-2 line-clamp-2">
                            {request.description}
                        </CardDescription>
                    </div>
                    <RequestStatusTag status={request.status} />
                </div>
            </CardHeader>

            <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                    {request.category && (
                        <div className="flex items-center gap-1.5">
                            <span className="font-medium">Category:</span>
                            <span>{request.category}</span>
                        </div>
                    )}

                    {request.budgetType && (
                        <div className="flex items-center gap-1.5">
                            <DollarSign className="h-4 w-4" />
                            <span>
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
                        <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            <span>Deadline: {new Date(request.deadline).toLocaleDateString()}</span>
                        </div>
                    )}

                    {request.responseDeadline && (
                        <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            <span>
                                Response by: {formatDistanceToNow(new Date(request.responseDeadline), { addSuffix: true })}
                            </span>
                        </div>
                    )}

                    {request.targetProvider && (
                        <div className="flex items-center gap-1.5">
                            <User className="h-4 w-4" />
                            <span>Direct to: {request.targetProvider.user?.firstName} {request.targetProvider.user?.lastName}</span>
                        </div>
                    )}

                    {request.proposals && request.proposals.length > 0 && (
                        <div className="flex items-center gap-1.5">
                            <span className="font-medium">Proposals:</span>
                            <span>{request.proposals.length}</span>
                        </div>
                    )}
                </div>

                {request.ndaRequired && (
                    <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                        NDA Required
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex items-center justify-between gap-4 pt-4 border-t border-gray-300">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                    Created {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                </div>
                <div className="flex gap-2">
                    {canCancel && onCancel && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onCancel(request.id);
                            }}
                        >
                            Cancel
                        </Button>
                    )}
                    <Button
                        variant="default"
                        size="sm"
                        onClick={handleViewDetails}
                        className="bg-[#7682e8] text-white"
                    >
                        View Details
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
};
