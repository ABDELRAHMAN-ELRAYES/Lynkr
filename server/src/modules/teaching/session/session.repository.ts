import PrismaClientSingleton from "../../../data-server-clients/prisma-client";
import { PrismaClient } from "@prisma/client";
import AppError from "../../../utils/app-error";
import { SessionStatus, ParticipantStatus } from "./types/ISession";

class SessionRepository {
    private prisma: PrismaClient;
    static instance: SessionRepository;

    private constructor() {
        this.prisma = PrismaClientSingleton.getPrismaClient();
    }

    static getInstance(): SessionRepository {
        if (!SessionRepository.instance) {
            SessionRepository.instance = new SessionRepository();
        }
        return SessionRepository.instance;
    }

    async createSession(slotId: string, instructorId: string, channelName: string) {
        try {
            return await this.prisma.teachingSession.create({
                data: {
                    slotId,
                    instructorId,
                    channelName
                },
                include: {
                    slot: {
                        include: {
                            providerProfile: {
                                select: {
                                    id: true,
                                    title: true,
                                    hourlyRate: true,
                                    user: { select: { id: true, firstName: true, lastName: true } }
                                }
                            }
                        }
                    },
                    participants: true
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to create session");
        }
    }

    async addParticipant(sessionId: string, userId: string) {
        try {
            return await this.prisma.sessionParticipant.create({
                data: {
                    sessionId,
                    userId
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to add participant");
        }
    }

    async getSessionById(id: string) {
        try {
            return await this.prisma.teachingSession.findUnique({
                where: { id },
                include: {
                    slot: {
                        include: {
                            providerProfile: {
                                select: {
                                    id: true,
                                    title: true,
                                    hourlyRate: true,
                                    user: { select: { id: true, firstName: true, lastName: true, email: true } }
                                }
                            }
                        }
                    },
                    participants: {
                        include: {
                            sessionPayment: {
                                include: {
                                    payment: true
                                }
                            }
                        }
                    },
                    conversation: true,
                    files: {
                        include: {
                            file: true
                        }
                    }
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to get session");
        }
    }

    async getSessionBySlotId(slotId: string) {
        try {
            return await this.prisma.teachingSession.findUnique({
                where: { slotId },
                include: {
                    participants: true
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to get session by slot");
        }
    }

    async getSessionsByUserId(userId: string) {
        try {
            return await this.prisma.teachingSession.findMany({
                where: {
                    participants: {
                        some: {
                            userId,
                            status: { not: "CANCELLED" }
                        }
                    }
                },
                include: {
                    slot: {
                        include: {
                            providerProfile: {
                                select: {
                                    id: true,
                                    title: true,
                                    user: { select: { id: true, firstName: true, lastName: true } }
                                }
                            }
                        }
                    },
                    participants: true
                },
                orderBy: {
                    slot: {
                        slotDate: "asc"
                    }
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to get user sessions");
        }
    }

    async getSessionsByInstructorId(instructorId: string) {
        try {
            return await this.prisma.teachingSession.findMany({
                where: { instructorId },
                include: {
                    slot: true,
                    participants: true
                },
                orderBy: {
                    slot: {
                        slotDate: "asc"
                    }
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to get instructor sessions");
        }
    }

    async updateSessionStatus(id: string, status: SessionStatus, additionalData?: object) {
        try {
            return await this.prisma.teachingSession.update({
                where: { id },
                data: {
                    status,
                    ...additionalData
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to update session status");
        }
    }

    async updateParticipantStatus(id: string, status: ParticipantStatus) {
        try {
            return await this.prisma.sessionParticipant.update({
                where: { id },
                data: { status }
            });
        } catch (error) {
            throw new AppError(500, "Failed to update participant status");
        }
    }

    async getParticipantBySessionAndUser(sessionId: string, userId: string) {
        try {
            return await this.prisma.sessionParticipant.findUnique({
                where: {
                    sessionId_userId: {
                        sessionId,
                        userId
                    }
                },
                include: {
                    sessionPayment: {
                        include: {
                            payment: true
                        }
                    }
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to get participant");
        }
    }

    async createSessionPayment(participantId: string, paymentId: string) {
        try {
            return await this.prisma.sessionPayment.create({
                data: {
                    participantId,
                    paymentId
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to create session payment");
        }
    }

    async recordAttendance(sessionId: string, userId: string) {
        try {
            return await this.prisma.sessionAttendance.create({
                data: {
                    sessionId,
                    userId
                }
            });
        } catch (error) {
            throw new AppError(500, "Failed to record attendance");
        }
    }

    async updateAttendanceLeft(sessionId: string, userId: string) {
        try {
            const attendance = await this.prisma.sessionAttendance.findFirst({
                where: { sessionId, userId, leftAt: null }
            });

            if (attendance) {
                return await this.prisma.sessionAttendance.update({
                    where: { id: attendance.id },
                    data: { leftAt: new Date() }
                });
            }

            return null;
        } catch (error) {
            throw new AppError(500, "Failed to update attendance");
        }
    }

    async createConversation(sessionId: string) {
        try {
            return await this.prisma.sessionConversation.create({
                data: { sessionId }
            });
        } catch (error) {
            throw new AppError(500, "Failed to create conversation");
        }
    }
}

export default SessionRepository;
