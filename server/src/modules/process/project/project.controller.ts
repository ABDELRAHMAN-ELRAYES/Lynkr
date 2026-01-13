import { Request, Response, NextFunction } from "express";
import ProjectService from "./project.service";
import { catchAsync } from "../../../utils/catch-async";
import { IUser } from "../../user/types/IUser";

export const createProject = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { proposalId, providerProfileId, totalPrice } = req.body;
    const clientId = (req.user as IUser).id;

    const project = await ProjectService.createProjectFromProposal(
        clientId,
        providerProfileId,
        proposalId,
        totalPrice,
        next
    );

    if (project) {
        res.status(201).json({
            status: "success",
            message: "Project created successfully",
            data: project
        });
    }
});

export const getProject = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const project = await ProjectService.getProjectById(req.params.id, next);

    if (project) {
        res.status(200).json({
            status: "success",
            data: project
        });
    }
});

export const getMyProjects = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = req.user as IUser;

    let projects: unknown;
    if (user.role === "CLIENT") {
        projects = await ProjectService.getClientProjects(user.id, next);
    } else if (user.providerProfile) {
        projects = await ProjectService.getProviderProjects(user.providerProfile.id, next);
    } else {
        projects = [];
    }

    if (projects) {
        res.status(200).json({
            status: "success",
            data: projects
        });
    }
});

export const markComplete = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = req.user as IUser;

    if (!user.providerProfile) {
        res.status(403).json({
            status: "error",
            message: "Only providers can mark projects as complete"
        });
        return;
    }

    const project = await ProjectService.markProjectComplete(
        req.params.id,
        user.id,
        user.providerProfile.id,
        next
    );

    if (project) {
        res.status(200).json({
            status: "success",
            message: "Project marked as complete",
            data: project
        });
    }
});

export const confirmComplete = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const clientId = (req.user as IUser).id;

    const project = await ProjectService.confirmProjectComplete(req.params.id, clientId, next);

    if (project) {
        res.status(200).json({
            status: "success",
            message: "Project completion confirmed. Funds released to provider.",
            data: project
        });
    }
});

export const cancelProject = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const clientId = (req.user as IUser).id;

    const project = await ProjectService.cancelProject(req.params.id, clientId, next);

    if (project) {
        res.status(200).json({
            status: "success",
            message: "Project cancelled. Funds refunded.",
            data: project
        });
    }
});

// ===== PROJECT FILES =====

export const uploadProjectFile = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = req.user as IUser;
    const file = req.file;

    if (!file) {
        res.status(400).json({
            status: "error",
            message: "No file uploaded"
        });
        return;
    }

    // Pass file metadata directly to ProjectService
    // The service/repo will handle the creation of the File record internally
    const projectFile = await ProjectService.uploadProjectFile(
        req.params.id,
        {
            filename: file.filename,
            path: file.path,
            mimetype: file.mimetype,
            size: file.size
        },
        user.id,
        user.providerProfile?.id,
        req.body.description,
        next
    );

    if (projectFile) {
        res.status(201).json({
            status: "success",
            message: "File uploaded successfully",
            data: projectFile
        });
    }
});

export const getProjectFiles = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = req.user as IUser;

    const files = await ProjectService.getProjectFiles(
        req.params.id,
        user.id,
        user.providerProfile?.id,
        next
    );

    if (files) {
        res.status(200).json({
            status: "success",
            data: files
        });
    }
});

export const deleteProjectFile = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = (req.user as IUser).id;

    const result = await ProjectService.deleteProjectFile(req.params.fileId, userId, next);

    if (result) {
        res.status(200).json({
            status: "success",
            message: "File deleted successfully"
        });
    }
});

// ===== PROJECT ACTIVITIES =====

export const getProjectActivities = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = req.user as IUser;

    const activities = await ProjectService.getProjectActivities(
        req.params.id,
        user.id,
        user.providerProfile?.id,
        next
    );

    if (activities) {
        res.status(200).json({
            status: "success",
            data: activities
        });
    }
});
