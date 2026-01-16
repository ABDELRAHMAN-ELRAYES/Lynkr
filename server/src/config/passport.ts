import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import config from "../config/config";
import UserRepository from "../modules/user/user.repository";

// Type for Google Auth result
export interface GoogleAuthResult {
    email: string;
    firstName: string;
    lastName: string;
    isNewUser: boolean;
    existingUser: any | null;
}

passport.use(
    new GoogleStrategy(
        {
            clientID: config.google.clientId,
            clientSecret: config.google.clientSecret,
            callbackURL: config.google.callbackUrl,
        },
        async (_accessToken: any, _refreshToken: any, profile: any, done: any) => {
            try {
                const email = profile.emails?.[0]?.value;
                if (!email) {
                    return done(new Error("No email found in Google profile"));
                }

                const userRepo = UserRepository.getInstance();

                // Check if user exists by email
                const existingUser = await userRepo.getUserByUsernameOrEmail(email);

                // Return profile data for frontend to handle
                const result: GoogleAuthResult = {
                    email,
                    firstName: profile.name?.givenName || "",
                    lastName: profile.name?.familyName || "",
                    isNewUser: !existingUser,
                    existingUser: existingUser || null
                };

                return done(null, result);
            } catch (error) {
                return done(error as Error);
            }
        }
    )
);

export default passport;
