const axios = require('axios');

module.exports.postToVerificationService = async serviceURL => {
  await axios.request({
    url: `${serviceURL}/verification/remove-inactive-licenses-from-queue`,
    headers: {},
    method: 'DELETE'
  });
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
