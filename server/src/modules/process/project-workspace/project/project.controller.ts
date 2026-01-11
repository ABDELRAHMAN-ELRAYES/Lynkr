import { Request, Response, NextFunction } from "express";
import ProjectService from "./project.service";

export const createProject = async (req: Request, res: Response, next: NextFunction) => {
    const { proposalId, providerProfileId, totalPrice } = req.body;
    const clientId = (req.user as any).id;

    const project = await ProjectService.createProjectFromProposal(
        clientId,
        providerProfileId,
        proposalId,
        totalPrice,
        next
    );

    if (project) {
        return res.status(201).json({
            status: "success",
            message: "Project created successfully",
            data: project
        });
    }
};

export const getProject = async (req: Request, res: Response, next: NextFunction) => {
    const project = await ProjectService.getProjectById(req.params.id, next);

    if (project) {
        return res.status(200).json({
            status: "success",
            data: project
        });
    }
};

export const getMyProjects = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as any;

    let projects: any;
    if (user.role === "CLIENT") {
        projects = await ProjectService.getClientProjects(user.id, next);
    } else if (user.providerProfile) {
        projects = await ProjectService.getProviderProjects(user.providerProfile.id, next);
    } else {
        projects = [];
    }

    if (projects) {
        return res.status(200).json({
            status: "success",
            data: projects
        });
    }
};

export const markComplete = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as any;

    if (!user.providerProfile) {
        return res.status(403).json({
            status: "error",
            message: "Only providers can mark projects as complete"
        });
    }

    const project = await ProjectService.markProjectComplete(
        req.params.id,
        user.id,
        user.providerProfile.id,
        next
    );

    if (project) {
        return res.status(200).json({
            status: "success",
            message: "Project marked as complete",
            data: project
        });
    }
};

export const confirmComplete = async (req: Request, res: Response, next: NextFunction) => {
    const clientId = (req.user as any).id;

    const project = await ProjectService.confirmProjectComplete(req.params.id, clientId, next);

    if (project) {
        return res.status(200).json({
            status: "success",
            message: "Project completion confirmed. Funds released to provider.",
            data: project
        });
    }
};

export const cancelProject = async (req: Request, res: Response, next: NextFunction) => {
    const clientId = (req.user as any).id;

    const project = await ProjectService.cancelProject(req.params.id, clientId, next);

    if (project) {
        return res.status(200).json({
            status: "success",
            message: "Project cancelled. Funds refunded.",
            data: project
        });
    }
};

// ===== PROJECT FILES =====

export const uploadProjectFile = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as any;
    const file = req.file;

    if (!file) {
        return res.status(400).json({
            status: "error",
            message: "No file uploaded"
        });
    }

    try {
        // Save file record to database first
        const savedFile = await FileService.saveFileRecord({
            filename: file.filename,
            path: file.path,
            mimetype: file.mimetype,
            size: file.size
        });

        // Then link to project
        const projectFile = await ProjectService.uploadProjectFile(
            req.params.id,
            savedFile.id,
            user.id,
            user.providerProfile?.id,
            req.body.description,
            next
        );

        if (projectFile) {
            return res.status(201).json({
                status: "success",
                message: "File uploaded successfully",
                data: projectFile
            });
        }
    } catch (error) {
        return next(error);
    }
};

export const getProjectFiles = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as any;

    const files = await ProjectService.getProjectFiles(
        req.params.id,
        user.id,
        user.providerProfile?.id,
        next
    );

    if (files) {
        return res.status(200).json({
            status: "success",
            data: files
        });
    }
};

export const deleteProjectFile = async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as any).id;

    const result = await ProjectService.deleteProjectFile(req.params.fileId, userId, next);

    if (result) {
        return res.status(200).json({
            status: "success",
            message: "File deleted successfully"
        });
    }
};

// ===== PROJECT ACTIVITIES =====

export const getProjectActivities = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as any;

    const activities = await ProjectService.getProjectActivities(
        req.params.id,
        user.id,
        user.providerProfile?.id,
        next
    );

    if (activities) {
        return res.status(200).json({
            status: "success",
            data: activities
        });
    }
};

