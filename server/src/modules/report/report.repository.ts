import PrismaClientSingleton from "../../data-server-clients/prisma-client";
import { PrismaClient } from "@prisma/client";
import AppError from "../../utils/app-error";
import {
    ICreateReportData,
    ICreateReportActionData,
    IReportQueryParams,
    ReportStatus
} from "./types/IReport";

class ReportRepository {
    private prisma: PrismaClient;
    static instance: ReportRepository;

    private constructor() {
        this.prisma = PrismaClientSingleton.getPrismaClient();
    }

    static getInstance(): ReportRepository {
        if (!ReportRepository.instance) {
            ReportRepository.instance = new ReportRepository();
        }
        return ReportRepository.instance;
    }

    getPrismaClient(): PrismaClient {
        return this.prisma;
    }

    // ===== CREATE OPERATIONS =====

    async createReport(data: ICreateReportData) {
        try {
            return await this.prisma.report.create({
                data: {
                    reporterId: data.reporterId,
                    targetType: data.targetType,
                    targetId: data.targetId,
                    targetUserId: data.targetUserId,
                    category: data.category,
                    description: data.description
                },
                include: {
                    reporter: {
                        select: { id: true, firstName: true, lastName: true, email: true }
                    }
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to create report");
        }
    }

    async addFileToReport(reportId: string, fileId: string) {
        try {
            return await this.prisma.reportFile.create({
                data: { reportId, fileId }
            });
        } catch (error) {
            throw new AppError(500, "Failed to add file to report");
        }
    }

    async createReportAction(data: ICreateReportActionData) {
        try {
            return await this.prisma.reportAction.create({
                data: {
                    reportId: data.reportId,
                    adminId: data.adminId,
                    actionType: data.actionType,
                    details: data.details
                },
                include: {
                    admin: {
                        select: { id: true, firstName: true, lastName: true }
                    }
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to create report action");
        }
    }

    // ===== READ OPERATIONS =====

    async getReportById(id: string) {
        try {
            return await this.prisma.report.findUnique({
                where: { id },
                include: {
                    reporter: {
                        select: { id: true, firstName: true, lastName: true, email: true }
                    },
                    targetUser: {
                        select: { id: true, firstName: true, lastName: true, email: true }
                    },
                    files: {
                        include: {
                            file: {
                                select: { id: true, filename: true, path: true, mimetype: true }
                            }
                        }
                    },
                    actions: {
                        include: {
                            admin: {
                                select: { id: true, firstName: true, lastName: true }
                            }
                        },
                        orderBy: { createdAt: "desc" }
                    }
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to get report");
        }
    }

    async getUserReports(userId: string, params: IReportQueryParams = {}) {
        const { page = 1, limit = 20, status, category } = params;
        const skip = (page - 1) * limit;

        const where: any = { reporterId: userId };
        if (status) where.status = status;
        if (category) where.category = category;

        try {
            const [reports, total] = await Promise.all([
                this.prisma.report.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: { createdAt: "desc" },
                    include: {
                        targetUser: {
                            select: { id: true, firstName: true, lastName: true }
                        }
                    }
                }),
                this.prisma.report.count({ where })
            ]);

            return {
                reports,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            };
        } catch (error) {
            throw new AppError(500, "Failed to get user reports");
        }
    }

    async getAllReports(params: IReportQueryParams = {}) {
        const { page = 1, limit = 20, status, category } = params;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (status) where.status = status;
        if (category) where.category = category;

        try {
            const [reports, total] = await Promise.all([
                this.prisma.report.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: { createdAt: "desc" },
                    include: {
                        reporter: {
                            select: { id: true, firstName: true, lastName: true, email: true }
                        },
                        targetUser: {
                            select: { id: true, firstName: true, lastName: true, email: true }
                        },
                        _count: { select: { actions: true, files: true } }
                    }
                }),
                this.prisma.report.count({ where })
            ]);

            return {
                reports,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            };
        } catch (error) {
            throw new AppError(500, "Failed to get all reports");
        }
    }

    // ===== UPDATE OPERATIONS =====

    async updateReportStatus(id: string, status: ReportStatus) {
        try {
            return await this.prisma.report.update({
                where: { id },
                data: { status }
            });
        } catch (error) {
            throw new AppError(500, "Failed to update report status");
        }
    }

    // ===== USER SUSPENSION =====

    async suspendUser(userId: string) {
        try {
            return await this.prisma.user.update({
                where: { id: userId },
                data: { active: false }
            });
        } catch (error) {
            throw new AppError(500, "Failed to suspend user");
        }
    }

    async unsuspendUser(userId: string) {
        try {
            return await this.prisma.user.update({
                where: { id: userId },
                data: { active: true }
            });
        } catch (error) {
            throw new AppError(500, "Failed to unsuspend user");
        }
    }
}

export default ReportRepository;
