'use strict';

function loadConfig() {
	return {
		jwt: {
			secret: process.env.JWT_SECRET || 'secret',
			expiresIn: 900,
			refreshExpiresIn: 86400,
			refreshCookie: 'refresh_token',
		},
		user: {
			rounds: 10,
		},
		pg: {
			connectionString: process.env.POSTGRESQL_CONNECTION_STRING || 'postgres://cuppa:toor@localhost/cuppa-authentication',
		},
		cookie: {
			secret: process.env.COOKIE_SECRET || 'my-secret',
			parseOptions: {},
		},
	};
}

module.exports = loadConfig;
