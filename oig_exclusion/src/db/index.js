const config = require('../config/knexfile.js');

const knex = require('knex')(config);

if (config.client === 'oracledb') {
  const { oracleHelper } = require('./utils');
  const {
    executeProcedure,
    executeFunction,
    executeNonQuery,
    executeNonQueryTrx,
    executeFunctionTrx
  } = oracleHelper(knex);

  knex.executeProcedure = executeProcedure;
  knex.executeFunction = executeFunction;
  knex.executeNonQuery = executeNonQuery;
  knex.executeNonQueryTrx = executeNonQueryTrx;
  knex.executeFunctionTrx = executeFunctionTrx;
} else if (config.client === 'sqlite3') {
  knex.executeProcedure = async () => {};
  knex.executeFunction = async () => {};
  knex.executeNonQuery = async () => {};
  knex.executeNonQueryTrx = async () => { };
  knex.executeFunctionTrx = async () => { };
}

module.exports = knex;
