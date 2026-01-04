import nodemailer from "nodemailer";
import config from "../config/config";

class EmailService {
    private static transporter = nodemailer.createTransport({
        host: config.email.host,
        port: config.email.port,
        secure: config.email.secure,
        auth: {
            user: config.email.user,
            pass: config.email.password,
        },
    });

    static async sendVerificationEmail(email: string, code: string): Promise<void> {
        await this.transporter.sendMail({
            from: config.email.from,
            to: email,
            subject: "Email Verification",
            html: `
        <h1>Email Verification</h1>
        <p>Your verification code is: <strong>${code}</strong></p>
        <p>This code will expire in 15 minutes.</p>
      `,
        });
    }

    static async sendPasswordResetEmail(email: string, code: string): Promise<void> {
        await this.transporter.sendMail({
            from: config.email.from,
            to: email,
            subject: "Password Reset",
            html: `
        <h1>Password Reset</h1>
        <p>Your password reset code is: <strong>${code}</strong></p>
        <p>This code will expire in 15 minutes.</p>
      `,
        });
    }

    static async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
        await this.transporter.sendMail({
            from: config.email.from,
            to: email,
            subject: "Welcome to Lynkr",
            html: `
        <h1>Welcome to Lynkr, ${firstName}!</h1>
        <p>Thank you for joining our platform.</p>
      `,
        });
    }
}

export default EmailService;
