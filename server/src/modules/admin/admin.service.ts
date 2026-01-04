import AdminRepository from "./admin.repository";

class AdminService {
    private static repository = AdminRepository.getInstance();

    static async getDashboardStats() {
        return await this.repository.getDashboardStats();
    }

    static async getAllUsers() {
        return await this.repository.getAllUsers();
    }
}

export default AdminService;
