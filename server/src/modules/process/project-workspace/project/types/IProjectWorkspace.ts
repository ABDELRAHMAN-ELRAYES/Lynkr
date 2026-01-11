// Project File Types - No Prisma dependencies

export type ActivityAction =
    | "PROJECT_STARTED"
    | "FILE_UPLOADED"
    | "FILE_DELETED"
    | "COMPLETION_REQUESTED"
    | "COMPLETION_CONFIRMED"
    | "PROJECT_CANCELLED"
    | "STATUS_CHANGED";

export interface IProjectFile {
    id: string;
    projectId: string;
    fileId: string;
    uploaderId: string;
    description: string | null;
    createdAt: Date;
}

export interface ICreateProjectFileData {
    projectId: string;
    fileId: string;
    uploaderId: string;
    description?: string;
}

export interface IProjectActivity {
    id: string;
    projectId: string;
    userId: string;
    action: ActivityAction;
    details: string | null;
    createdAt: Date;
}

export interface ICreateActivityData {
    projectId: string;
    userId: string;
    action: ActivityAction;
    details?: string;
}

export interface IProjectFileWithDetails extends IProjectFile {
    file: {
        id: string;
        filename: string;
        path: string;
        mimetype: string;
        size: number;
    };
    uploader: {
        id: string;
        firstName: string;
        lastName: string;
    };
}

export interface IProjectActivityWithUser extends IProjectActivity {
    user: {
        id: string;
        firstName: string;
        lastName: string;
    };
}
