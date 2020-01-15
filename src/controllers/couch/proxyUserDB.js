import httpProxy from 'http-proxy';
import logger from '../../logger';

const couchProxy = httpProxy.createProxyServer();

const proxyUserDB = (req, res, next) => {
	if (!res.locals.user) {
		logger.error('user was not found in proxy');
		//apm
		return next();
	}
	const hex = Buffer.from(res.locals.user.name).toString('hex');

	couchProxy.web(req, res, {
		target: `http://odin:password@localhost:5984/userdb-${hex}/`
	});
};

export default proxyUserDB;
