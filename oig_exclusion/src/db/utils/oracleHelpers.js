const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OBJECT;

function buildParameters(parameters) {
  const bindVariables = Object.keys(parameters).map(k => `${k} => :${k}`);
  const newParameters = {};
  Object.keys(parameters).forEach(k => {
    if (k === 'creturn') {
      newParameters[k] = { type: oracledb.CURSOR, dir: oracledb.BIND_OUT };
    } else if (Array.isArray(parameters[k])) {
      newParameters[k] = {
        type: oracledb.NUMBER,
        dir: oracledb.BIND_IN,
        val: parameters[k]
      };
    } else if (
      parameters[k] &&
      parameters[k].constructor === Object &&
      parameters[k].dir === 'out'
    ) {
      newParameters[k] = { dir: oracledb.BIND_OUT };
    } else {
      newParameters[k] = parameters[k];
    }
  });
  return { parameters: newParameters, bindVariables: bindVariables.join(', ') };
}

function receiveStream(stream) {
  return new Promise((resolve, reject) => {
    const collect = [];
    stream.on('data', data => {
      collect.push(data);
    });

    stream.on('error', error => {
      reject(error);
    });

    stream.on('end', () => {
      resolve(collect);
    });
  });
}

module.exports = knex => {
  const executeProcedure = async (procedureName, params = {}) => {
    params = { ...params, creturn: '' };
    const connection = await knex.client.acquireConnection();
    try {
      const { parameters, bindVariables } = buildParameters(params);
      const result = await connection.execute(
        `BEGIN ${procedureName}(${bindVariables}); END;`,
        parameters
      );
      const { creturn } = result.outBinds;
      const data = await receiveStream(creturn.toQueryStream());
      return data;
    } catch (error) {
      throw error.stack;
    } finally {
      try {
        await knex.client.releaseConnection(connection);
      } catch (error) {
        //
      }
    }
  };

  const executeFunction = async (
    functionName,
    params = {},
    outMaxSize = 4000
  ) => {
    const connection = await knex.client.acquireConnection();
    try {
      const { parameters, bindVariables } = buildParameters(params);
      parameters.return = {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: outMaxSize
      };
      const result = await connection.execute(
        `BEGIN :return := ${functionName}(${bindVariables}); END;`,
        parameters
      );
      return result.outBinds.return;
    } catch (error) {
      throw error.stack;
    } finally {
      try {
        await knex.client.releaseConnection(connection);
      } catch (error) {
        //
      }
    }
  };

  const executeNonQuery = async (procedureName, params = {}) => {
    const connection = await knex.client.acquireConnection();
    try {
      const { parameters, bindVariables } = buildParameters(params);
      const result = await connection.execute(
        `BEGIN ${procedureName}(${bindVariables}); END;`,
        parameters
      );
      const out = {};
      for (var p in params) {
        if (params[p] && params[p].dir === 'out') {
          out[p] = result.outBinds[p];
        }
      }
      return out;
    } catch (error) {
      throw error.stack;
    } finally {
      try {
        await knex.client.releaseConnection(connection);
      } catch (error) {
        //
      }
    }
  };

  const executeNonQueryTrx = async (procedureName, params = {}, trx) => {

    const { parameters, bindVariables } = buildParameters(params);
    const result = await knex
      .raw(`BEGIN ${procedureName}(${bindVariables}); END;`, parameters)
      .transacting(trx);
    return result;

  };

  const executeFunctionTrx = async (functionName, params = {}, trx) => {

    const { parameters, bindVariables } = buildParameters(params);

    return knex //"temporal" fix just for ORACLE
      .raw(`SELECT ${functionName}(${bindVariables}) R FROM DUAL`, parameters)
      .transacting(trx)
      .then(([result]) => result.R);

  };

  return {
    executeProcedure,
    executeNonQuery,
    executeFunction,
    executeNonQueryTrx,
    executeFunctionTrx
  };
};
