import { FC } from 'react';
import type { ReviewStats } from '@/shared/types/review';
import { RatingStars } from '@/shared/components/common/RatingStars';
import { Star } from 'lucide-react';

interface RatingsSummaryProps {
    stats: ReviewStats;
    className?: string;
}

export const RatingsSummary: FC<RatingsSummaryProps> = ({ stats, className = '' }) => {
    const { averageRating, totalReviews, starDistribution } = stats;

    const maxDistribution = Math.max(...Object.values(starDistribution));

    if (totalReviews === 0) {
        return (
            <div className={`bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center ${className}`}>
                <Star className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                <p className="text-gray-500 dark:text-gray-400">No reviews yet</p>
            </div>
        );
    }

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
            {/* Overall Rating */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                            {averageRating.toFixed(1)}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">/ 5</span>
                    </div>
                    <RatingStars rating={averageRating} size="lg" />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>

            {/* Star Distribution */}
            <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                    const count = starDistribution[star as keyof typeof starDistribution];
                    const percentage = maxDistribution > 0 ? (count / maxDistribution) * 100 : 0;

                    return (
                        <div key={star} className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400 w-3">
                                {star}
                            </span>
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400 w-8 text-right">
                                {count}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
