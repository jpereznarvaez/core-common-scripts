require('dotenv').config();

const worker = require('./worker');

worker().then(console.log).catch(console.log);
