import Stripe from "stripe";
import { NextFunction } from "express";
import config from "../../../config/config";
import AppError from "../../../utils/app-error";
import SessionRepository from "./session.repository";
import SlotRepository from "../slot/slot.repository";
import PaymentRepository from "../../process/money-system/payment/payment.repository";
import NotificationService from "../../notification/notification.service";
import { randomUUID } from "crypto";

const stripe = new Stripe(config.stripe.secretKey, {
    apiVersion: "2025-02-24.acacia",
});

class SessionService {
    private static sessionRepo = SessionRepository.getInstance();
    private static slotRepo = SlotRepository.getInstance();
    private static paymentRepo = PaymentRepository.getInstance();

    static async bookSession(
        userId: string,
        slotId: string,
        next: NextFunction
    ) {
        // Get slot details
        const slot = await this.slotRepo.getSlotById(slotId);

        if (!slot) {
            return next(new AppError(404, "Slot not found"));
        }

        // Prevent instructor from booking own session
        if (slot.providerProfile?.user?.id === userId) {
            return next(new AppError(400, "You cannot book your own session"));
        }

        // Validate slot is not in the past
        const now = new Date();
        const slotDateTime = new Date(slot.slotDate);
        const [hours, minutes] = slot.startTime.split(":").map(Number);
        slotDateTime.setHours(hours, minutes, 0, 0);

        if (slotDateTime < now) {
            return next(new AppError(400, "Cannot book past slot"));
        }

        // Check if user can participate
        const existingSession = await this.sessionRepo.getSessionBySlotId(slotId);

        if (existingSession) {
            // Check if user already booked
            const existingParticipant = await this.sessionRepo.getParticipantBySessionAndUser(
                existingSession.id,
                userId
            );

            if (existingParticipant && existingParticipant.status === "BOOKED") {
                return next(new AppError(400, "You have already booked this session"));
            }

            // For one-to-one, check if slot is full
            if (slot.sessionType === "ONE_TO_ONE" && existingSession.participants.length > 0) {
                return next(new AppError(400, "This one-to-one slot is already booked"));
            }

            // For group, check max participants
            if (slot.sessionType === "GROUP") {
                const activeParticipants = existingSession.participants.filter(
                    p => p.status !== "CANCELLED"
                );
                if (activeParticipants.length >= slot.maxParticipants) {
                    return next(new AppError(400, "Session is full"));
                }
            }
        }

        // Calculate price
        const hourlyRate = Number(slot.providerProfile?.hourlyRate || 0);
        const durationMinutes = slot.durationMinutes;
        const sessionPrice = (hourlyRate * durationMinutes) / 60;

        if (sessionPrice <= 0) {
            return next(new AppError(400, "Invalid session price. Provider hourly rate not set."));
        }

        // Create Stripe payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(sessionPrice * 100), // Convert to cents
            currency: "usd",
            metadata: {
                slotId,
                userId,
                type: "SESSION"
            }
        });

        // Create payment record
        const payment = await this.paymentRepo.createPayment({
            payerId: userId,
            amount: sessionPrice,
            paymentType: "SESSION"
        });

        await this.paymentRepo.updatePayment(payment.id, {
            stripePaymentId: paymentIntent.id
        });

        return {
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            paymentId: payment.id,
            slotId,
            sessionPrice,
            currency: "USD"
        };
    }

    static async confirmBooking(
        userId: string,
        slotId: string,
        paymentId: string,
        next: NextFunction
    ) {
        const slot = await this.slotRepo.getSlotById(slotId);

        if (!slot) {
            return next(new AppError(404, "Slot not found"));
        }

        // Get or create session
        let session = await this.sessionRepo.getSessionBySlotId(slotId);

        if (!session) {
            // Create new session
            const channelName = `teaching_${randomUUID()}`;
            const instructorId = slot.providerProfile?.user.id || "";

            session = await this.sessionRepo.createSession(slotId, instructorId, channelName);

            // Create conversation for 1-to-1 sessions
            if (slot.sessionType === "ONE_TO_ONE") {
                await this.sessionRepo.createConversation(session.id);
            }
        }

        // Add participant
        const participant = await this.sessionRepo.addParticipant(session.id, userId);

        // Link payment to participant
        await this.sessionRepo.createSessionPayment(participant.id, paymentId);

        // Update payment status
        await this.paymentRepo.updatePayment(paymentId, {
            status: "COMPLETED",
            paidAt: new Date()
        });

        // Notify Student
        await NotificationService.sendSystemNotification(
            userId,
            "Booking Confirmed",
            `Your session for ${slot.startTime} on ${new Date(slot.slotDate).toDateString()} is confirmed.`
        );

        // Notify Instructor
        if (slot.providerProfile?.user?.id) {
            await NotificationService.sendSystemNotification(
                slot.providerProfile.user.id,
                "New Session Booking",
                "A new student has booked a session with you."
            );
        }

        return await this.sessionRepo.getSessionById(session.id);
    }

    static async getSessionById(id: string, userId: string, next: NextFunction) {
        const session = await this.sessionRepo.getSessionById(id);

        if (!session) {
            return next(new AppError(404, "Session not found"));
        }

        // Verify user is participant or instructor
        const isParticipant = session.participants.some(p => p.userId === userId);
        const isInstructor = session.instructorId === userId;

        if (!isParticipant && !isInstructor) {
            return next(new AppError(403, "Not authorized to view this session"));
        }

        return session;
    }

    static async getMySessions(userId: string, _next: NextFunction) {
        return await this.sessionRepo.getSessionsByUserId(userId);
    }

    static async getInstructorSessions(instructorId: string, _next: NextFunction) {
        return await this.sessionRepo.getSessionsByInstructorId(instructorId);
    }

    static async startSession(sessionId: string, instructorId: string, next: NextFunction) {
        const session = await this.sessionRepo.getSessionById(sessionId);

        if (!session) {
            return next(new AppError(404, "Session not found"));
        }

        if (session.instructorId !== instructorId) {
            return next(new AppError(403, "Only the instructor can start the session"));
        }

        if (session.status !== "SCHEDULED") {
            return next(new AppError(400, `Session cannot be started. Current status: ${session.status}`));
        }

        // Notify participants
        for (const p of session.participants) {
            if (p.status === "BOOKED") {
                await NotificationService.sendSystemNotification(
                    p.userId,
                    "Session Started",
                    "Your session has started. Please join now."
                );
            }
        }

        return await this.sessionRepo.updateSessionStatus(sessionId, "IN_PROGRESS", {
            startedAt: new Date()
        });
    }

    static async completeSession(sessionId: string, instructorId: string, next: NextFunction) {
        const session = await this.sessionRepo.getSessionById(sessionId);

        if (!session) {
            return next(new AppError(404, "Session not found"));
        }

        if (session.instructorId !== instructorId) {
            return next(new AppError(403, "Only the instructor can complete the session"));
        }

        if (session.status !== "IN_PROGRESS") {
            return next(new AppError(400, `Session cannot be completed. Current status: ${session.status}`));
        }

        // Notify participants
        for (const p of session.participants) {
            if (p.status === "BOOKED") {
                await NotificationService.sendSystemNotification(
                    p.userId,
                    "Session Completed",
                    "The session has been marked as completed."
                );
            }
        }

        return await this.sessionRepo.updateSessionStatus(sessionId, "COMPLETED", {
            completedAt: new Date()
        });
    }

    static async cancelSession(sessionId: string, userId: string, next: NextFunction) {
        const session = await this.sessionRepo.getSessionById(sessionId);

        if (!session) {
            return next(new AppError(404, "Session not found"));
        }

        if (session.status === "COMPLETED" || session.status === "CANCELLED") {
            return next(new AppError(400, `Session cannot be cancelled. Current status: ${session.status}`));
        }

        const isInstructor = session.instructorId === userId;
        const participant = session.participants.find(p => p.userId === userId);

        if (!isInstructor && !participant) {
            return next(new AppError(403, "Not authorized to cancel this session"));
        }

        if (isInstructor) {
            // Instructor cancels: refund all participants
            for (const p of session.participants) {
                if (p.sessionPayment?.payment) {
                    // Refund via Stripe
                    if (p.sessionPayment.payment.stripePaymentId) {
                        try {
                            await stripe.refunds.create({
                                payment_intent: p.sessionPayment.payment.stripePaymentId
                            });
                        } catch (error) {
                            console.error(`Failed to refund payment ${p.sessionPayment.payment.id}:`, error);
                        }
                    }

                    await this.paymentRepo.updatePayment(p.sessionPayment.payment.id, {
                        status: "REFUNDED"
                    });
                }

                await this.sessionRepo.updateParticipantStatus(p.id, "REFUNDED");

                // Notify participant
                await NotificationService.sendSystemNotification(
                    p.userId,
                    "Session Cancelled",
                    "The instructor has cancelled the session. A refund has been issued."
                );
            }

            return await this.sessionRepo.updateSessionStatus(sessionId, "CANCELLED");
        } else if (participant) {
            // Student cancels: refund only their payment
            if (participant.sessionPayment?.payment) {
                if (participant.sessionPayment.payment.stripePaymentId) {
                    try {
                        await stripe.refunds.create({
                            payment_intent: participant.sessionPayment.payment.stripePaymentId
                        });
                    } catch (error) {
                        console.error(`Failed to refund payment ${participant.sessionPayment.payment.id}:`, error);
                    }
                }

                await this.paymentRepo.updatePayment(participant.sessionPayment.payment.id, {
                    status: "REFUNDED"
                });
            }

            await this.sessionRepo.updateParticipantStatus(participant.id, "REFUNDED");

            // Notify Instructor
            await NotificationService.sendSystemNotification(
                session.instructorId,
                "Booking Cancelled",
                "A student has cancelled their booking for your session."
            );

            // Check if session should be cancelled (no remaining participants)
            const remainingParticipants = session.participants.filter(
                p => p.id !== participant.id && p.status === "BOOKED"
            );

            if (remainingParticipants.length === 0) {
                return await this.sessionRepo.updateSessionStatus(sessionId, "CANCELLED");
            }

            return await this.sessionRepo.getSessionById(sessionId);
        }
    }

    static async joinSession(sessionId: string, userId: string, next: NextFunction) {
        const session = await this.sessionRepo.getSessionById(sessionId);

        if (!session) {
            return next(new AppError(404, "Session not found"));
        }

        const isParticipant = session.participants.some(p => p.userId === userId && p.status === "BOOKED");
        const isInstructor = session.instructorId === userId;

        if (!isParticipant && !isInstructor) {
            return next(new AppError(403, "Not authorized to join this session"));
        }

        if (session.status !== "IN_PROGRESS") {
            return next(new AppError(400, "Session is not in progress"));
        }

        // Record attendance
        await this.sessionRepo.recordAttendance(sessionId, userId);

        return {
            channelName: session.channelName,
            session
        };
    }

    static async leaveSession(sessionId: string, userId: string, _next: NextFunction) {
        await this.sessionRepo.updateAttendanceLeft(sessionId, userId);

        return { message: "Left session successfully" };
    }
}

export default SessionService;
