import nano from 'nano';

const options = {
	url: 'http://odin:password@localhost:5984'
	/*headers: {
		["X-Auth-CouchDB-UserName"]: "odin",
		["X-Auth-CouchDB-Roles"]: [],
		["X-Auth-CouchDB-Token"]: ""
	}*/
};

const nanoDB = nano(options);

const usersDB = nanoDB.use('_users');

export { nanoDB, usersDB };
