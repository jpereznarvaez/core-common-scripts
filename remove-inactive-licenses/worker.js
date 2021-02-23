'use strict';
const { SERVICE_URL, SLACK_WEBHOOK_URL } = process.env;
const { postToVerificationService, postToSlack } = require('./functions');

module.exports.removeInactiveLicensesProcess = async () => {
  try {
    console.info('Starting...!');

    console.info(`Sending Request...`);
    await postToVerificationService(SERVICE_URL);

    console.info(`Notifying in Slack Channel`);
    await postToSlack(
      SLACK_WEBHOOK_URL,
      'The Inactive licenses were removed :tamo-activo: :andamo-ruleta:'
    );
  } catch (error) {
    console.error('Error [removeInactiveLicensesProcess] process: ', error);
  } finally {
    console.info('Ending...!');
  }
};
