import { nanoDB } from '../../db';
import logger from '../../logger';

const isUserRegistered = async email => {
	try {
		const res = await nanoDB.request({
			path: '_users/_find',
			method: 'post',
			body: {
				selector: { email },
				limit: 1,
				fields: ['name']
			}
		});
		if (res.docs && res.docs.length === 1) {
			return true;
		} else {
			return false;
		}
	} catch (e) {
		logger.error(e);
		// apm
		return false;
	}
};

export default isUserRegistered;
