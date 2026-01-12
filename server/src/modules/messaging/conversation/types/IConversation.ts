export interface IConversation {
    id: string;
    projectId: string;
    participant1Id: string;
    participant2Id: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateConversationData {
    projectId: string;
    participant1Id: string;
    participant2Id: string;
}

export interface IConversationWithDetails extends IConversation {
    participant1: {
        id: string;
        firstName: string;
        lastName: string;
    };
    participant2: {
        id: string;
        firstName: string;
        lastName: string;
    };
    project: {
        id: string;
        status: string;
    };
    lastMessage?: {
        content: string;
        createdAt: Date;
        senderId: string;
    } | null;
    unreadCount: number;
}
