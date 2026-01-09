// Re-export all services for easy importing
export { authService } from './authService';
export { rbacService } from './rbacService';
export { notificationService } from './notificationService';
export { messageService } from './messageService';
export { paymentService } from './paymentService';
export { agoraService } from './agoraService';
export { userService } from './userService';
export { profileService } from './profileService';
export { default as apiClient } from './apiClient';

// Re-export types
export type { LoginCredentials, RegisterData, AuthResponse } from './authService';
export type { Role, Permission } from './rbacService';
export type { Notification } from './notificationService';
export type { Message, MessageRequest } from './messageService';
export type { PaymentIntentRequest, Transaction } from './paymentService';
export type { AgoraToken } from './agoraService';
export type { UserResponse } from './userService';
export type {
    CreateFullProfileRequest,
    ProfileRequest,
    ProfileRequestWithUser,
    ProfileRequestWithFullData,
    CreateProfileEducation,
    CreateProfileWorkHistory,
    CreateProfileLanguage
} from './profileService';
