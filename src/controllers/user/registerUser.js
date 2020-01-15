import Joi from '@hapi/joi';

import UserStore from '../../stores/user';
import logger from '../../logger';

const handleEmailError = err => {
	switch (err.type) {
		case 'any.empty':
		case 'any.required':
			err.message = 'Email is required';
			break;
		case 'string.email':
			err.message = 'Email is not valid';
			break;
		default:
			break;
	}
	return err;
};

const handlePasswordError = err => {
	switch (err.type) {
		case 'any.empty':
		case 'any.required':
			err.message = 'Password is required';
			break;
		case 'string.min':
			err.message = `Password should have atleast ${
				err.context.limit
			} characters`;
			break;
		default:
			break;
	}
	return err;
};

const userSchema = Joi.object().keys({
	email: Joi.string()
		.email()
		.required()
		.error(errors => errors.map(err => handleEmailError(err))),
	password: Joi.string()
		.min(8)
		.required()
		.error(errors => errors.map(err => handlePasswordError(err)))
});

const registerUser = async (req, res, next) => {
	const auth = req.body;
	const { error: schemaError } = Joi.validate(auth, userSchema);

	if (schemaError) {
		const messages = schemaError.details
			.map(detail => detail.message)
			.join();
		res.status(400).json({ err: true, mes: messages });
		return next();
	}

	if (await UserStore.isUserRegistered(auth.email)) {
		res.status(409).json({ err: true, mes: 'Email already exists' });
		return next();
	}

	try {
		const user = await UserStore.createUser(auth);
		res.status(201).json({
			ok: true,
			mes: 'User successfully created',
			name: user.name,
			date_joined: user.date_joined
		});
	} catch (e) {
		logger.error(e);
		// apm
		res.status(400).json({ e });
	}
};

export default registerUser;
