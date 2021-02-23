const axios = require('axios');

module.exports.postOldLVservice = async (
  machineKey,
  serviceURL,
  machineNumber,
  commandProcess
) => {
  await axios.post(
    `${serviceURL}${machineNumber}/lv-task/run`,
    {
      task: commandProcess
    },
    {
      headers: {
        'x-api-key': machineKey
      }
    }
  );
};

module.exports.postToSlack = async (webhookURL, message) => {
  await axios.post(webhookURL, {
    attachments: [
      {
        text: message,
        ts: new Date().getTime() / 1000
      }
    ]
  });
};

module.exports.waiting = (delay) =>
  new Promise(function (resolve) {
    setTimeout(resolve, delay);
  });
