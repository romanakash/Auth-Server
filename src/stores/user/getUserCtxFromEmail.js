import { nanoDB } from '../../db';
import logger from '../../logger';

const getUserCtxFromEmail = async email => {
	if (!email) return null;

	try {
		const res = await nanoDB.request({
			path: '_users/_find',
			method: 'post',
			body: {
				selector: { email },
				limit: 1,
				fields: ['_id', '_rev', 'name', 'email', 'date_joined']
			}
		});
		if (res.docs && res.docs.length === 1) {
			return res.docs[0];
		} else {
			return null;
		}
	} catch (e) {
		logger.error(e);
		// apm
		return null;
	}
};

export default getUserCtxFromEmail;
