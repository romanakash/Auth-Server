import uuidv4 from 'uuid/v4';
import moment from 'moment';

import { usersDB } from '../../db';

const createUser = async ({ email, password }) => {
	const name = uuidv4();
	const date_joined = moment().toISOString();
	const _id = `org.couchdb.user:${name}`;

	const user = Object.assign(
		{},
		{
			_id,
			name,
			email,
			password,
			date_joined,
			type: 'user',
			roles: []
		}
	);
	// let calling function catch err
	await usersDB.insert(user);
	return user;
};

export default createUser;
