import Queue from "bull";
import config from "../config/config";
import nodemailer from "nodemailer";

// Create email queue
const emailQueue = new Queue("email", {
    redis: {
        host: config.redis.host,
        port: config.redis.port,
    },
});

// Email transporter
const transporter = nodemailer.createTransport({
    host: config.mail.host,
    port: config.mail.port,
    secure: config.mail.secure,
    auth: {
        user: config.mail.user,
        pass: config.mail.password,
    },
});

// Process email jobs
emailQueue.process(async (job) => {
    const { to, subject, html, text } = job.data;

    try {
        await transporter.sendMail({
            from: config.mail.from,
            to,
            subject,
            html,
            text,
        });

        console.log(`Email sent to ${to}: ${subject}`);
        return { success: true };
    } catch (error) {
        console.error(`Failed to send email to ${to}:`, error);
        throw error;
    }
});

// Add email to queue
export const queueEmail = async (emailData: {
    to: string;
    subject: string;
    html: string;
    text?: string;
}) => {
    await emailQueue.add(emailData, {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 2000,
        },
    });
};

export default emailQueue;
