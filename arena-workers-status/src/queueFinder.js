const rowsSelector = '#queueList > tbody:nth-child(2) > tr';
const hostSelector = 'td:nth-child(1)';
const queueNamesSelector = 'td:nth-child(2)';

const selectors = {
  rows: rowsSelector,
  host: hostSelector,
  queueNames: queueNamesSelector
};

function getQueueName(selectors) {
  const rows = document.querySelectorAll(selectors.rows);
  const queues = [];

  for (let row of rows) {
    const hostname = row.querySelector(selectors.host).innerText;
    const queueName = row.querySelector(selectors.queueNames).innerText;

    queues.push({ hostname, queueName });
  }

  return queues;
}

module.exports = { getQueueName, selectors };
