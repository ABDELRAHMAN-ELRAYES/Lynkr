import { FC } from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
    rating: number; 
    size?: 'sm' | 'md' | 'lg';
    showValue?: boolean;
    count?: number;
    className?: string;
}

export const RatingStars: FC<RatingStarsProps> = ({
    rating,
    size = 'md',
    showValue = false,
    count,
    className = '',
}) => {
    const sizeClasses = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5',
    };

    const textSizeClasses = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
    };

    const stars = Array.from({ length: 5 }, (_, i) => {
        const fillPercentage = Math.min(Math.max(rating - i, 0), 1) * 100;

        return (
            <div key={i} className="relative inline-block">
                {/* Background star (empty) */}
                <Star className={`${sizeClasses[size]} text-gray-300`} />

                {/* Foreground star (filled) */}
                <div
                    className="absolute top-0 left-0 overflow-hidden"
                    style={{ width: `${fillPercentage}%` }}
                >
                    <Star className={`${sizeClasses[size]} fill-yellow-400 text-yellow-400`} />
                </div>
            </div>
        );
    });

    return (
        <div className={`flex items-center gap-1 ${className}`}>
            <div className="flex items-center">
                {stars}
            </div>
            {showValue && (
                <span className={`font-semibold text-gray-900 dark:text-gray-100 ${textSizeClasses[size]}`}>
                    {rating.toFixed(1)}
                </span>
            )}
            {count !== undefined && (
                <span className={`text-gray-500 dark:text-gray-400 ${textSizeClasses[size]}`}>
                    ({count})
                </span>
            )}
        </div>
    );
};
