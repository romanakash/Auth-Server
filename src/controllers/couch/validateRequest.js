import passport from 'passport';

const validateRequest = (req, res, next) => {
	passport.authenticate('jwt', { session: false }, (err, user, info) => {
		if (err) {
			res.status(400).json(err);
			return next();
		}
		// convert passport error to own scheme
		if (info.hasOwnProperty('message')) {
			info = {
				err: true,
				mes: info.message
			};
		}
		if (info.err) {
			res.status(200).json({ ...info });
			return next();
		}
		res.locals.user = user;
		return next();
	})(req, res, next);
};

export default validateRequest;
