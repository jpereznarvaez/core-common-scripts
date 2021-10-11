const axios = require('axios');

const { enableArenaAuth, arenaAuth, arenaApiUrl } = require('../config');

async function addTestJob(hostname, queueName) {
  const config = enableArenaAuth ? { auth: arenaAuth } : null;
  await axios.post(
    `${arenaApiUrl}/queue/${hostname}/${queueName}/job`,
    {
      name: queueName,
      test: 'THIS_IS_A_TEST'
    },
    config
  );
}

module.exports = {
  addTestJob
};
