import { FC, useState } from 'react';
import { Star, AlertCircle } from 'lucide-react';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import Button from '@/shared/components/ui/Button';
import type { CreateProjectReviewPayload, CreateSessionReviewPayload } from '@/shared/types/review';

interface ReviewFormProps {
    type: 'project' | 'session';
    onSubmit: (payload: CreateProjectReviewPayload | CreateSessionReviewPayload) => Promise<void>;
    onCancel?: () => void;
    loading?: boolean;
}

interface FormErrors {
    rating?: string;
    comment?: string;
}

export const ReviewForm: FC<ReviewFormProps> = ({ type, onSubmit, onCancel, loading = false }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [errors, setErrors] = useState<FormErrors>({});
    const [hoveredRating, setHoveredRating] = useState<number | null>(null);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (rating === 0) {
            newErrors.rating = 'Rating is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const payload: CreateProjectReviewPayload | CreateSessionReviewPayload = {
            rating,
            comment: comment.trim() || undefined,
        };

        await onSubmit(payload);
    };

    const displayValue = hoveredRating !== null ? hoveredRating : rating;

    const getRatingLabel = (value: number): string => {
        switch (value) {
            case 1: return 'Poor';
            case 2: return 'Fair';
            case 3: return 'Good';
            case 4: return 'Very Good';
            case 5: return 'Excellent';
            default: return 'Not rated';
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                    Your honest feedback helps improve the platform. Rate your overall experience from 1 (poor) to 5 (excellent).
                </p>
            </div>

            {/* Overall Rating */}
            <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Overall Rating <span className="text-red-500">*</span>
                </Label>
                <div className="flex flex-col items-center gap-3 py-4 px-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => {
                                    setRating(star);
                                    if (errors.rating) {
                                        setErrors((prev) => ({ ...prev, rating: undefined }));
                                    }
                                }}
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(null)}
                                className="transition-all duration-150 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#7682e8] focus:ring-offset-2 rounded"
                            >
                                <Star
                                    className={`w-10 h-10 transition-colors ${star <= displayValue
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-300 dark:text-gray-600'
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                    <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                        {displayValue > 0 ? `${displayValue}/5 - ${getRatingLabel(displayValue)}` : 'Select a rating'}
                    </span>
                </div>
                {errors.rating && (
                    <div className="flex items-center gap-1.5 text-sm text-red-500">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.rating}</span>
                    </div>
                )}
            </div>

            {/* Comment */}
            <div className="space-y-2">
                <Label htmlFor="comment" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Your Experience (Optional)
                </Label>
                <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={type === 'project'
                        ? "How was your experience with this provider? What did they do well? Any areas for improvement?"
                        : "How was your tutoring session? Was the instructor helpful and knowledgeable?"
                    }
                    rows={5}
                    className={errors.comment ? 'border-red-500' : ''}
                    maxLength={1000}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
                    {comment.length}/1000 characters
                </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                        Cancel
                    </Button>
                )}
                <Button type="submit" disabled={loading || rating === 0} className="bg-[#7682e8] text-white">
                    {loading ? 'Submitting...' : 'Submit Review'}
                </Button>
            </div>
        </form>
    );
};
