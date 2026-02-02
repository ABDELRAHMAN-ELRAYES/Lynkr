
// ============================================
// Teaching Service - Demo / Mock Implementation
// ============================================

import { CreateSlotPayload, SessionVideoInfo, TeachingSession, TeachingSlot } from "../types/teaching";
// Mock data store
let mockSlots: TeachingSlot[] = [
    {
        id: '1',
        providerId: 'p1',
        slotDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), // Tomorrow
        startTime: '09:00',
        endTime: '10:00',
        durationMinutes: 60,
        sessionType: 'ONE_TO_ONE',
        maxParticipants: 1,
        isBooked: false,
        price: 50,
        currency: 'USD',
        providerProfile: {
            id: 'prof1',
            title: 'Senior Math Tutor',
            hourlyRate: 50,
            user: {
                firstName: 'John',
                lastName: 'Doe'
            }
        }
    },
    {
        id: '2',
        providerId: 'p1',
        slotDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(), // Day after tomorrow
        startTime: '14:00',
        endTime: '15:30',
        durationMinutes: 90,
        sessionType: 'GROUP',
        maxParticipants: 5,
        isBooked: true,
        session: {
            id: 's1',
            slotId: '2',
            status: 'SCHEDULED',
            participantCount: 3
        },
        price: 30,
        currency: 'USD',
        providerProfile: {
            id: 'prof1',
            title: 'Senior Math Tutor',
            hourlyRate: 50,
            user: {
                firstName: 'John',
                lastName: 'Doe'
            }
        }
    }
];

let mockSessions: TeachingSession[] = [
    {
        id: 'sess1',
        providerId: 'p1',
        status: 'SCHEDULED',
        participants: [
            { userId: 'u2', name: 'Alice Smith' },
            { userId: 'u3', name: 'Bob Johnson' }
        ],
        slot: mockSlots[1]
    }
];

export const teachingService = {
    getMySlots: async (): Promise<TeachingSlot[]> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        return [...mockSlots];
    },

    createSlot: async (payload: CreateSlotPayload): Promise<TeachingSlot> => {
        await new Promise(resolve => setTimeout(resolve, 800));
        const newSlot: TeachingSlot = {
            id: Math.random().toString(36).substr(2, 9),
            providerId: 'current-user',
            ...payload,
            maxParticipants: payload.maxParticipants || 1,
            isBooked: false,
            providerProfile: {
                id: 'prof1',
                title: 'Myself',
                hourlyRate: 50,
                user: {
                    firstName: 'Me',
                    lastName: ''
                }
            }
        };
        mockSlots.push(newSlot);
        return newSlot;
    },

    updateSlot: async (id: string, payload: Partial<CreateSlotPayload>): Promise<TeachingSlot> => {
        await new Promise(resolve => setTimeout(resolve, 800));
        const index = mockSlots.findIndex(s => s.id === id);
        if (index === -1) throw new Error('Slot not found');

        mockSlots[index] = { ...mockSlots[index], ...payload };
        return mockSlots[index];
    },

    deleteSlot: async (id: string): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, 800));
        mockSlots = mockSlots.filter(s => s.id !== id);
    },

    getProviderSlots: async (providerId: string): Promise<TeachingSlot[]> => {
        await new Promise(resolve => setTimeout(resolve, 800));
        // Return all mock slots for demo purposes regardless of providerId
        return [...mockSlots];
    },

    bookSession: async (slotId: string): Promise<{ success: boolean; amount: number; orderId: string }> => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const slot = mockSlots.find(s => s.id === slotId);
        if (!slot) throw new Error('Slot not found');

        // Mark as booked (mock)
        slot.isBooked = true;

        return {
            success: true,
            amount: (slot.price || 0) * 100, // in cents
            orderId: 'ord_' + Math.random().toString(36).substr(2, 9)
        };
    },

    getInstructorSessions: async (): Promise<TeachingSession[]> => {
        await new Promise(resolve => setTimeout(resolve, 800));
        return [...mockSessions];
    },

    getSessionById: async (sessionId: string): Promise<TeachingSession> => {
        await new Promise(resolve => setTimeout(resolve, 800));
        const session = mockSessions.find(s => s.id === sessionId);
        if (!session) throw new Error('Session not found');
        return session;
    },

    getMySessions: async (): Promise<TeachingSession[]> => {
        await new Promise(resolve => setTimeout(resolve, 800));
        // Return same mock sessions for demo
        return [...mockSessions];
    },

    startSession: async (sessionId: string): Promise<{ success: boolean; videoInfo: SessionVideoInfo }> => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const session = mockSessions.find(s => s.id === sessionId);
        if (session) {
            session.status = 'IN_PROGRESS';
            session.startedAt = new Date().toISOString();
        }

        return {
            success: true,
            videoInfo: {
                channelName: `session_${sessionId}`,
                token: 'mock_agora_token',
                uid: 12345
            }
        };
    },

    completeSession: async (sessionId: string): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, 800));
        const session = mockSessions.find(s => s.id === sessionId);
        if (session) {
            session.status = 'COMPLETED';
            session.endedAt = new Date().toISOString();
        }
    },

    cancelSession: async (sessionId: string): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, 800));
        const session = mockSessions.find(s => s.id === sessionId);
        if (session) {
            session.status = 'CANCELLED';
        }
    },

    joinSession: async (sessionId: string): Promise<{ success: boolean; videoInfo: SessionVideoInfo }> => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
            success: true,
            videoInfo: {
                channelName: `session_${sessionId}`,
                token: 'mock_agora_token',
                uid: Math.floor(Math.random() * 100000)
            }
        };
    },

    leaveSession: async (sessionId: string): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        // Nothing to update in mock state for leaving
    }
};



