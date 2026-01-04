export type IReview = {
    id: string;
    userId: string;
    targetId: string;
    rating: number;
    comment?: string;
    createdAt: Date;
    updatedAt: Date;
};

export type CreateReviewRequest = {
    userId: string;
    targetId: string;
    rating: number;
    comment?: string;
};

export type ReviewResponse = IReview;
