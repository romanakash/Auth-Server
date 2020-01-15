import { nanoDB } from '../../db';

const isCredentialsCorrect = async ({ name, password }) => {
	try {
		const res = await nanoDB.request({
			path: '_session',
			method: 'post',
			body: {
				name,
				password
			}
		});
		// unneccessary checking but let it be
		if (res.ok) {
			return true;
		} else {
			return false;
		}
	} catch (e) {
		// if couch returns 401
		return false;
	}
};

export default isCredentialsCorrect;
