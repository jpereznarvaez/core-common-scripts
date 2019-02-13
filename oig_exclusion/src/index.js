require('dotenv').config({ path: 'src/.env' });

let requiredEnv = ['VERIFICATION_PORT', 'ORA_CLIENT', 'ORA_USER', 'ORA_PASSWORD', 'ORA_CONNECTSTRING', 'URL_HR_QUEUE', 'URL_LV_SERVICE'];

for (let envVar of requiredEnv) {

     console.log(process.env[envVar]);
    if (!process.env[envVar])
  
    throw new Error(`${envVar} env varible must be declared in .env file`);

}

let app = require('./app/');
// let app = require('./exclusion/');