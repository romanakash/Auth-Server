import passport from 'passport';
import LocalStrategy from 'passport-local';
import PassportJwt from 'passport-jwt';
const JwtStrategy = PassportJwt.Strategy;
const ExtractJwt = PassportJwt.ExtractJwt;

import UserStore from './stores/user';

passport.use(
	new LocalStrategy(
		{
			usernameField: 'email',
			passwordField: 'password',
			session: false
		},
		async (email, password, done) => {
			// get couchdb _user name from email provided
			const userCtx = await UserStore.getUserCtxFromEmail(email);
			if (userCtx) {
				const couchLoginBody = {
					name: userCtx.name,
					password
				};
				if (await UserStore.isCredentialsCorrect(couchLoginBody)) {
					return done(null, userCtx, {
						ok: true,
						mes: 'Authenticated Successfully'
					});
				}
			}
			// if userCtx returns null or isCredentials returns false
			return done(null, false, {
				err: true,
				mes: 'Incorrect email or password'
			});
		}
	)
);

passport.use(
	new JwtStrategy(
		{
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: 'jwtkey'
		},
		async (payload, done) => {
			const userCtx = await UserStore.getUserCtxFromEmail(payload.email);
			if (userCtx && userCtx.name === payload.name) {
				return done(null, userCtx, {
					ok: true,
					mes: 'Logged in ',
					userCtx
				});
			}
			return done(null, false, {
				err: true,
				mes: 'Invalid token user not found',
				email: payload.email
			});
		}
	)
);
