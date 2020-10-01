require('dotenv').config({ path: 'src/.env' });

let requiredEnv = ['ORA_CLIENT', 'ORA_USER', 'ORA_PASSWORD', 'ORA_CONNECTSTRING'];

for (let envVar of requiredEnv) {

    if (!process.env[envVar])
  
    throw new Error(`${envVar} env varible must be declared in .env file`);

}

let app = require('./app/');
// let app = require('./exclusion/');