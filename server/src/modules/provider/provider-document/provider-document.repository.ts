import { PrismaClient, ProviderDocument } from "@prisma/client";
import { ICreateDocumentData, IUpdateDocumentData } from "./types/IProviderDocument";

class ProviderDocumentRepository {
    private static instance: ProviderDocumentRepository;
    private prisma: PrismaClient;

    private constructor() {
        this.prisma = new PrismaClient();
    }

    public static getInstance(): ProviderDocumentRepository {
        if (!ProviderDocumentRepository.instance) {
            ProviderDocumentRepository.instance = new ProviderDocumentRepository();
        }
        return ProviderDocumentRepository.instance;
    }

    public getPrismaClient(): PrismaClient {
        return this.prisma;
    }

    // Create a new document
    async createDocument(providerProfileId: string, data: ICreateDocumentData): Promise<ProviderDocument> {
        // First, create the file record
        const file = await this.prisma.file.create({
            data: {
                filename: data.file.filename,
                path: data.file.path,
                mimetype: data.file.mimetype,
                size: data.file.size,
            },
        });

        // Then create the document
        return await this.prisma.providerDocument.create({
            data: {
                providerProfileId,
                title: data.title,
                description: data.description,
                documentType: data.documentType,
                fileId: file.id,
                isPublic: data.isPublic ?? false,
            },
            include: {
                file: true,
            },
        });
    }

    // Get all documents for a provider
    async getDocumentsByProfileId(providerProfileId: string) {
        return await this.prisma.providerDocument.findMany({
            where: { providerProfileId },
            include: {
                file: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    // Get public documents for a provider (for client view)
    async getPublicDocumentsByProfileId(providerProfileId: string) {
        return await this.prisma.providerDocument.findMany({
            where: {
                providerProfileId,
                isPublic: true,
            },
            include: {
                file: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    // Get a single document by ID
    async getDocumentById(id: string) {
        return await this.prisma.providerDocument.findUnique({
            where: { id },
            include: {
                file: true,
                providerProfile: {
                    include: {
                        user: true,
                    },
                },
            },
        });
    }

    // Update a document
    async updateDocument(id: string, data: IUpdateDocumentData) {
        return await this.prisma.providerDocument.update({
            where: { id },
            data,
            include: {
                file: true,
            },
        });
    }

    // Delete a document
    async deleteDocument(id: string) {
        const document = await this.prisma.providerDocument.findUnique({
            where: { id },
            include: { file: true },
        });

        if (!document) {
            return null;
        }

        // Delete the document (will cascade delete the file relation)
        await this.prisma.providerDocument.delete({
            where: { id },
        });

        // Delete the actual file record
        await this.prisma.file.delete({
            where: { id: document.fileId },
        });

        return document;
    }

    // Toggle document privacy
    async togglePrivacy(id: string, isPublic: boolean) {
        return await this.prisma.providerDocument.update({
            where: { id },
            data: { isPublic },
            include: {
                file: true,
            },
        });
    }
}

export default ProviderDocumentRepository;
