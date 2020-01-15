import Joi from '@hapi/joi';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const generateToken = userCtx => {
	const jwtOptions = {
		expiresIn: '10m',
		issuer: 'theAlmightyRoman'
	};
	const payload = {
		name: userCtx.name,
		email: userCtx.email,
		date_joined: userCtx.date_joined
	};
	return jwt.sign(payload, 'jwtkey', jwtOptions);
};

const authSchema = Joi.object().keys({
	email: Joi.string().required(),
	password: Joi.string().required()
});

const authenticateUser = (req, res, next) => {
	const auth = req.body;
	const { error: schemaError } = Joi.validate(auth, authSchema);

	if (schemaError) {
		res.status(400).json({
			err: true,
			mes: 'Request body should be of form {email:,password:}'
		});
		return next();
	}
	passport.authenticate(
		'local',
		{ session: false },
		(error, userCtx, info) => {
			if (error) {
				res.status(400).json(error);
				return next();
			}
			if (!userCtx) {
				res.status(401).json(info);
				return next();
			}
			req.login(userCtx, { session: false }, err => {
				if (err) {
					res.status(400).json(err);
					return next();
				}
				const token = generateToken(userCtx);
				res.status(200).json({ ...info, token });
			});
		}
	)(req, res, next);
};

export default authenticateUser;
