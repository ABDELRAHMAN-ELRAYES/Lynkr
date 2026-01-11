export type IMessage = {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export type CreateMessageRequest = {
    senderId: string;
    receiverId: string;
    content: string;
};

export type MessageResponse = IMessage;
