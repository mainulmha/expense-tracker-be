const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        let user = await User.findOne({ email });

        // 🔥 If user exists → connect Google if needed
        if (user) {
          if (user.provider === "local") {
            user.provider = "google";
            user.providerId = profile.id;
            user.avatar = profile.photos?.[0]?.value;
            user.isVerified = true;

            await user.save();
          }

          return done(null, user);
        }

        // 🔥 New user → create
        user = await User.create({
          name: profile.displayName,
          email,
          provider: "google",
          providerId: profile.id,
          avatar: profile.photos?.[0]?.value,
          isVerified: true,
        });

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);

module.exports = passport;
