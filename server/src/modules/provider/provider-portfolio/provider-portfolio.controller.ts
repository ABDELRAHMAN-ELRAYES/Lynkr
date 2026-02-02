import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../../utils/catch-async";
import ProviderPortfolioService from "./provider-portfolio.service";
import { IUser } from "../../user/types/IUser";
import { ICreatePortfolioProjectData, IUpdatePortfolioProjectData, IAddProjectImageData } from "./types/IProviderPortfolio";

/**
 * Create a new portfolio project
 */
export const createProject = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const user = request.user as IUser;
        const { name, description, projectLink, isPublic, tags } = request.body;

        // Files should be uploaded via multer middleware (multiple files)
        const files = request.files as Express.Multer.File[];
        if (!files || files.length === 0) {
            response.status(400).json({
                status: "fail",
                message: "At least one image is required",
            });
            return;
        }

        if (files.length > 5) {
            response.status(400).json({
                status: "fail",
                message: "Maximum of 5 images allowed per project",
            });
            return;
        }

        const data: ICreatePortfolioProjectData = {
            name,
            description,
            projectLink,
            isPublic: isPublic === 'true' || isPublic === true,
            tags: tags ? (Array.isArray(tags) ? tags : JSON.parse(tags)) : [],
            images: files.map((file, index) => ({
                filename: file.filename,
                path: file.path,
                mimetype: file.mimetype,
                size: file.size,
                order: index,
            })),
        };

        const project = await ProviderPortfolioService.createProject(user.id, data, next);
        if (!project) return;

        response.status(201).json({
            status: "success",
            data: { project },
        });
    }
);

/**
 * Get all projects for authenticated provider
 */
export const getMyProjects = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const user = request.user as IUser;

        const projects = await ProviderPortfolioService.getMyProjects(user.id, next);
        if (!projects) return;

        response.status(200).json({
            status: "success",
            data: { projects },
        });
    }
);

/**
 * Get a single project
 */
export const getProjectById = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const user = request.user as IUser | undefined;
        const id = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;

        const project = await ProviderPortfolioService.getProjectById(id, user?.id, next);
        if (!project) return;

        response.status(200).json({
            status: "success",
            data: { project },
        });
    }
);

/**
 * Update a project
 */
export const updateProject = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const user = request.user as IUser;
        const id = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
        const { name, description, projectLink, isPublic, tags } = request.body;

        const data: IUpdatePortfolioProjectData = {
            name,
            description,
            projectLink,
            isPublic,
            tags: tags ? (Array.isArray(tags) ? tags : JSON.parse(tags)) : undefined,
        };

        const project = await ProviderPortfolioService.updateProject(id, user.id, data, next);
        if (!project) return;

        response.status(200).json({
            status: "success",
            data: { project },
        });
    }
);

/**
 * Delete a project
 */
export const deleteProject = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const user = request.user as IUser;
        const id = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;

        const result = await ProviderPortfolioService.deleteProject(id, user.id, next);
        if (!result) return;

        response.status(200).json({
            status: "success",
            message: result.message,
        });
    }
);

/**
 * Add an image to a project
 */
export const addProjectImage = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const user = request.user as IUser;
        const projectId = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
        const file = request.file;

        if (!file) {
            response.status(400).json({
                status: "fail",
                message: "No file uploaded",
            });
            return;
        }

        const data: IAddProjectImageData = {
            file: {
                filename: file.filename,
                path: file.path,
                mimetype: file.mimetype,
                size: file.size,
            },
            order: request.body.order ? parseInt(request.body.order) : undefined,
        };

        const image = await ProviderPortfolioService.addProjectImage(projectId, user.id, data, next);
        if (!image) return;

        response.status(201).json({
            status: "success",
            data: { image },
        });
    }
);

/**
 * Remove an image from a project
 */
export const removeProjectImage = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const user = request.user as IUser;
        const projectId = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
        const imageId = Array.isArray(request.params.imageId) ? request.params.imageId[0] : request.params.imageId;

        const result = await ProviderPortfolioService.removeProjectImage(projectId, imageId, user.id, next);
        if (!result) return;

        response.status(200).json({
            status: "success",
            message: result.message,
        });
    }
);

/**
 * Toggle project privacy
 */
export const toggleProjectPrivacy = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const user = request.user as IUser;
        const id = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
        const { isPublic } = request.body;

        const project = await ProviderPortfolioService.togglePrivacy(id, user.id, isPublic, next);
        if (!project) return;

        response.status(200).json({
            status: "success",
            data: { project },
        });
    }
);

/**
 * Get public projects for a provider (for profile/client view)
 */
export const getPublicProjectsByProfileId = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const profileId = Array.isArray(request.params.profileId) ? request.params.profileId[0] : request.params.profileId;

        const projects = await ProviderPortfolioService.getPublicProjects(profileId, next);
        if (!projects) return;

        response.status(200).json({
            status: "success",
            data: { projects },
        });
    }
);

/**
 * Get a public project by ID (for client view with full details)
 */
export const getPublicProjectById = catchAsync(
    async (request: Request, response: Response, next: NextFunction) => {
        const projectId = Array.isArray(request.params.projectId) ? request.params.projectId[0] : request.params.projectId;

        const project = await ProviderPortfolioService.getPublicProjectById(projectId, next);
        if (!project) return;

        response.status(200).json({
            status: "success",
            data: { project },
        });
    }
);
