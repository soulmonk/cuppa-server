'use strict';

function loadConfig() {
	return {
		jwt: {
			secret: process.env.JWT_SECRET || 'secret',
			addHook: false,
		},
		pg: {
			connectionString: process.env.POSTGRESQL_CONNECTION_STRING || 'postgres://cuppa:toor@localhost/cuppa-finance-stats',
		},
		redis: {
			port: 6379,
			host: process.env.REDIS_HOST || '127.0.0.1',
		},
	};
}

module.exports = loadConfig;
