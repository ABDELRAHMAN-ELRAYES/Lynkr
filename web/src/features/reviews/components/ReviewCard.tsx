import { FC } from 'react';
import type { Review } from '@/shared/types/review';
import { RatingStars } from '@/shared/components/common/RatingStars';
import { User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ReviewCardProps {
    review: Review;
    className?: string;
}

export const ReviewCard: FC<ReviewCardProps> = ({ review, className = '' }) => {
    const reviewerName = review.reviewer
        ? `${review.reviewer.firstName} ${review.reviewer.lastName}`
        : 'Anonymous';

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
            {/* Reviewer Info */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {review.reviewer?.avatar ? (
                            <img
                                src={review.reviewer.avatar}
                                alt={reviewerName}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User className="w-5 h-5 text-gray-400" />
                        )}
                    </div>
                    <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{reviewerName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                        </p>
                    </div>
                </div>

                {/* Overall Rating */}
                <RatingStars rating={review.rating} size="md" showValue />
            </div>

            {/* Comment */}
            {review.comment && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                        {review.comment}
                    </p>
                </div>
            )}

            {/* Project/Session Badge */}
            {review.projectReview && (
                <div className="mt-4 inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                    Project Review
                </div>
            )}
            {review.sessionReview && (
                <div className="mt-4 inline-block px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded">
                    Session Review
                </div>
            )}
        </div>
    );
};
