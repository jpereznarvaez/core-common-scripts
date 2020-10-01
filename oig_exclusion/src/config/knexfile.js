const path = require('path');
const BASE_PATH = path.join(__dirname, 'server', 'db');

const {
  ORA_CLIENT,
  ORA_USER,
  ORA_PASSWORD,
  ORA_CONNECTSTRING,
  NODE_ENV = 'development'
} = process.env;

const connectionData = {
  client: ORA_CLIENT,
  connection: {
    user: ORA_USER,
    password: ORA_PASSWORD,
    connectString: ORA_CONNECTSTRING
  }
};

const testingData = {
  client: 'sqlite3',
  connection: {
    filename: ':memory:'
  },
  useNullAsDefault: true,
  migrations: {
    directory: path.join(BASE_PATH, 'migrations')
  },
  seeds: {
    directory: path.join(BASE_PATH, 'seeds')
  }
};

module.exports = NODE_ENV === 'test' ? testingData : connectionData;