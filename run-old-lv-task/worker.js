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

const ARRTMachines = ['five', 'six', 'seven'];

module.exports.restartTaskOldLVProcess = async () => {
  try {
    let errors = [];
    console.info('[restartTaskOldLVProcess] Starting... Sending Request...!');
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

      messageText = `💥 [restartTaskOldLVProcess] We had errors in the following machines:\n${messageText}`;

      console.info('[restartTaskOldLVProcess] Notifying in Slack Channel');
      await postToSlack(SLACK_WEBHOOK_URL, messageText);
    }
  } catch (error) {
    console.error('[restartTaskOldLVProcess] Error process: ', error);
  } finally {
    console.info('[restartTaskOldLVProcess] Ending...!');
  }
};

module.exports.restartARRTTaskOldLVProcess = async () => {
  try {
    let errors = [];
    console.info(
      '[restartARRTTaskOldLVProcess] Starting... Sending Request...!'
    );
    for (const machine of ARRTMachines) {
      try {
        await postOldLVservice(
          LV_MACHINES_API_KEY,
          SERVICE_URL,
          machine,
          'CERTIFICATIONS ARRT WEBSERVICE'
        );
        await waiting(300);
      } catch (error) {
        errors.push({ machine, message: error.message });
      }
    }

    if (errors.length) {
      let messageText = errors.reduce((prev, info) => {
        const { machine, message } = info;
        return `machine(${machine}):${message} 👀\n`;
      }, '');

      messageText = `💥 [restartARRTTaskOldLVProcess] We had errors in the following machines:\n${messageText}`;

      console.info('[restartARRTTaskOldLVProcess] Notifying in Slack Channel');
      await postToSlack(SLACK_WEBHOOK_URL, messageText);
    }
  } catch (error) {
    console.error('[restartARRTTaskOldLVProcess] Error process: ', error);
  } finally {
    console.info('[restartARRTTaskOldLVProcess] Ending...!');
  }
};
