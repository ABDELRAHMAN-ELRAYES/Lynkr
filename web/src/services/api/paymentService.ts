import apiClient from './apiClient';

export interface PaymentIntentRequest {
    payerId: string;
    payeeId: string;
    amount: number;
    currency: string;
    operationId: string;
    description: string;
}

export interface Transaction {
    id: string;
    operationId: string;
    payerId: string;
    payeeId: string;
    amount: number;
    currency: string;
    status: string;
    paymentType: string;
    stripePaymentIntentId?: string;
    stripeChargeId?: string;
    createdAt: string;
    completedAt?: string;
}

export const paymentService = {
    // Create payment intent
    createPaymentIntent: async (data: PaymentIntentRequest) => {
        const response = await apiClient.post<{
            success: boolean;
            data: {
                clientSecret: string;
                paymentIntentId: string;
                amount: number;
                currency: string;
            };
        }>('/payments/create-intent', data);
        return response.data.data;
    },

    // Get transaction by ID
    getTransaction: async (transactionId: string) => {
        const response = await apiClient.get<{ success: boolean; data: Transaction }>(
            `/payments/${transactionId}`
        );
        return response.data.data;
    },

    // Get operation transactions
    getOperationTransactions: async (operationId: string) => {
        const response = await apiClient.get<{ success: boolean; data: Transaction[] }>(
            `/payments/operation/${operationId}`
        );
        return response.data.data;
    },

    // Get user transactions
    getUserTransactions: async (userId: string) => {
        const response = await apiClient.get<{ success: boolean; data: Transaction[] }>(
            `/payments/user/${userId}`
        );
        return response.data.data;
    },

    // Get user earnings
    getUserEarnings: async (userId: string) => {
        const response = await apiClient.get<{ success: boolean; data: { totalEarnings: number } }>(
            `/payments/user/${userId}/earnings`
        );
        return response.data.data.totalEarnings;
    },

    // Calculate commission
    calculateCommission: async (amount: number) => {
        const response = await apiClient.post<{
            success: boolean;
            data: {
                amount: number;
                commission: number;
                payeeAmount: number;
            };
        }>('/payments/calculate-commission', { amount });
        return response.data.data;
    },

    // Process refund
    processRefund: async (transactionId: string, reason: string) => {
        const response = await apiClient.post<{ success: boolean; data: Transaction }>(
            `/payments/${transactionId}/refund`,
            { reason }
        );
        return response.data.data;
    },
};
