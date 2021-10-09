const { arenaUiUrl } = require('./config');

const {
  scraper,
  jobChecker,
  queueFinder: { getQueueName, selectors }
} = require('./src');

module.exports = async function workersStatus() {
  console.log('Running...');
  console.log('Navigating to the Website');

  const queues = await scraper.evaluateFunction(
    arenaUiUrl,
    getQueueName,
    selectors
  );

  console.log('Checking the Queues');

  const errors = [];

  for (let queue of queues) {
    const { hostname, queueName } = queue;

    try {
      await jobChecker.addTestJob(hostname, queueName);
    } catch (error) {
      errors.push({
        message: error.message,
        queue: `${hostname}/${queueName}`
      });
    }
  }

  console.log('Finishing Details');
  return errors.length ? error : "Everything it's OK";
};
