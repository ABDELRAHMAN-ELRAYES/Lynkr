export type INotification = {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: string;
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export type CreateNotificationRequest = {
    userId: string;
    title: string;
    message: string;
    type: string;
};

export type NotificationResponse = INotification;
