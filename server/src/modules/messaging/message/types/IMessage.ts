export interface IMessage {
    id: string;
    conversationId: string;
    senderId: string;
    content: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateMessageData {
    conversationId: string;
    senderId: string;
    content: string;
}

export interface IMessageWithSender extends IMessage {
    sender: {
        id: string;
        firstName: string;
        lastName: string;
    };
}
