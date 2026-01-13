import AppError from "../../utils/app-error";

class OperationRepository {
    static instance: OperationRepository;

    private constructor() {
        // PrismaClient is available but not directly needed for stub methods
    }

    static getInstance(): OperationRepository {
        if (!OperationRepository.instance) {
            OperationRepository.instance = new OperationRepository();
        }
        return OperationRepository.instance;
    }

    // TODO: Add Operation model to Prisma schema
    async createOperation(_data: object): Promise<object> {
        throw new AppError(501, "Operation module not implemented");
    }

    async getAllOperations(): Promise<object[]> {
        throw new AppError(501, "Operation module not implemented");
    }

    async getOperationById(_id: string): Promise<object | null> {
        throw new AppError(501, "Operation module not implemented");
    }

    async updateOperation(_id: string, _data: object): Promise<object> {
        throw new AppError(501, "Operation module not implemented");
    }

    async deleteOperation(_id: string): Promise<object> {
        throw new AppError(501, "Operation module not implemented");
    }
}

export default OperationRepository;
