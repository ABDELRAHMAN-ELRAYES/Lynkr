import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import config from "../config/config";
import UserService from "../modules/user/user.service";

passport.use(
    new GoogleStrategy(
        {
            clientID: config.google.clientId,
            clientSecret: config.google.clientSecret,
            callbackURL: config.google.callbackURL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value;
                if (!email) {
                    return done(new Error("No email found in Google profile"));
                }

                // Check if user exists
                let user = await UserService.getUserByUsernameOrEmail(email, () => { });

                if (!user) {
                    // Create new user from Google profile
                    user = await UserService.saveUser(
                        {
                            email,
                            firstName: profile.name?.givenName || "",
                            lastName: profile.name?.familyName || "",
                            password: Math.random().toString(36).slice(-12), // Random password
                            role: "USER",
                            active: true,
                            emailVerified: true,
                        },
                        () => { }
                    );
                }

                return done(null, user);
            } catch (error) {
                return done(error as Error);
            }
        }
    )
);

export default passport;
