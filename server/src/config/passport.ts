import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import config from "../config/config";
import UserService from "../modules/user/user.service";
import AppError from "../utils/app-error";

passport.use(
    new GoogleStrategy(
        {
            clientID: config.google.clientId,
            clientSecret: config.google.clientSecret,
            callbackURL: config.google.callbackUrl,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async (_accessToken: any, _refreshToken: any, profile: any, done: any) => {
            try {
                const email = profile.emails?.[0]?.value;
                if (!email) {
                    return done(new AppError(400, "No email found in Google profile"));
                }

                // Check if user exists
                let user = await UserService.getUserByUsernameOrEmail(email, () => { });

                if (!user) {
                    // Create new user from Google profile
                    const newUser = await UserService.saveUser(
                        {
                            email,
                            firstName: profile.name?.givenName || "",
                            lastName: profile.name?.familyName || "",
                            password: Math.random().toString(36).slice(-12),
                            phone: "",
                            role: "CLIENT" as any,
                        },
                        () => { }
                    );

                    if (!newUser) {
                        return done(new AppError(500, "Failed to create user"));
                    }
                    user = newUser;
                }

                return done(null, user);
            } catch (error) {
                return done(error as Error);
            }
        }
    )
);

export default passport;
