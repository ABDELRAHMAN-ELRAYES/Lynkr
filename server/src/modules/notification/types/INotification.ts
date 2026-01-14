// Notification Types for Module 9: Notifications & Activity Feed

// Notification types
export type NotificationType =
    | "MESSAGE"
    | "PROPOSAL"
    | "PROJECT"
    | "PAYMENT"
    | "REVIEW"
    | "SESSION"
    | "SYSTEM";

// Notification categories
export type NotificationCategory =
    | "COMMUNICATION"
    | "REQUESTS_PROPOSALS"
    | "PAYMENTS"
    | "PROJECT_SESSION"
    | "REVIEWS"
    | "SYSTEM";

// Entity types for deep linking
export type EntityType =
    | "PROJECT"
    | "REQUEST"
    | "PROPOSAL"
    | "SESSION"
    | "REVIEW"
    | "MESSAGE"
    | "PAYMENT";

// Base notification interface
export interface INotification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    category: NotificationCategory;
    entityId?: string | null;
    entityType?: EntityType | null;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Input for creating a notification
export interface ICreateNotificationData {
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    category?: NotificationCategory;
    entityId?: string;
    entityType?: EntityType;
}

// Pagination parameters
export interface INotificationQueryParams {
    page?: number;
    limit?: number;
    isRead?: boolean;
    type?: NotificationType;
    category?: NotificationCategory;
}

// Paginated response
export interface INotificationPaginatedResponse {
    notifications: INotification[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Unread count response
export interface IUnreadCountResponse {
    count: number;
}

// Maps notification type to default category
export const getDefaultCategory = (type: NotificationType): NotificationCategory => {
    switch (type) {
        case "MESSAGE":
            return "COMMUNICATION";
        case "PROPOSAL":
            return "REQUESTS_PROPOSALS";
        case "PROJECT":
            return "PROJECT_SESSION";
        case "PAYMENT":
            return "PAYMENTS";
        case "REVIEW":
            return "REVIEWS";
        case "SESSION":
            return "PROJECT_SESSION";
        case "SYSTEM":
            return "SYSTEM";
        default:
            return "SYSTEM";
    }
};
