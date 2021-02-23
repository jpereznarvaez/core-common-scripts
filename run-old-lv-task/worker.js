'use strict';

const { SERVICE_URL, SLACK_WEBHOOK_URL, LV_MACHINES_API_KEY } = process.env;
const { postOldLVservice, postToSlack, waiting } = require('./functions');
const { processes } = require('./lv-processes');
const allMachines = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'seventeen',
  'eighteen',
  'nineteen',
  'twenty'
];

module.exports.restartTaskOldLVProcess = async () => {
  try {
    let errors = [];
    console.info('Starting... Sending Request...!');
    for (const machine of allMachines) {
      try {
        for (const { command } of processes) {
          await postOldLVservice(
            LV_MACHINES_API_KEY,
            SERVICE_URL,
            machine,
            command
          );
          await waiting(300);
        }
      } catch (error) {
        errors.push({ machine, message: error.message });
      }
    }

    if (errors.length) {
      let messageText = errors.reduce((prev, info) => {
        const { machine, message } = info;
        return `machine(${machine}):${message} 👀\n`;
      }, '');

      messageText = `💥 We had errors in the following machines:\n${messageText}`;

      console.info(`Notifying in Slack Channel`);
      await postToSlack(SLACK_WEBHOOK_URL, messageText);
    }
  } catch (error) {
    console.error('Error [restartTaskOldLVProcess] process: ', error);
  } finally {
    console.info('Ending...!');
  }
};
