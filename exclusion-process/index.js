'use strict';
require('dotenv').config();
const axios = require('axios');
const CronJob = require('cron').CronJob;
const {
  SLACK_WEBHOOK_URL,
  EXCLUSION_TASKS_CRON_EXP,
  SERVICE_URL: serviceUrl,
  LV_MACHINES_API_KEY: LV_API_KEY,
  EXCLUSION_DATE,
  EXCLUSION_TYPE
} = process.env;

const exclusionMachines = [
  { machineName: 'one', machineNumber: 1 },
  { machineName: 'two', machineNumber: 2 },
  { machineName: 'three', machineNumber: 3 },
  { machineName: 'four', machineNumber: 4 },
  { machineName: 'five', machineNumber: 5 }
];

function runExclusion(machineName, exclusionCommand) {
  return axios.post(
    `${serviceUrl}${machineName}/lv-task/run`,
    {
      task: exclusionCommand
    },
    {
      headers: {
        'x-api-key': LV_API_KEY
      }
    }
  );
}

const postToSlack = async (webhookURL, message) => {
  await axios.post(webhookURL, {
    attachments: [
      {
        text: message,
        ts: new Date().getTime() / 1000
      }
    ]
  });
};

async function exclusionProcess() {
  let success = [],
    errors = [];
  for (const { machineName, machineNumber } of exclusionMachines) {
    try {
      const exclusionCommand = `EXCLUSIONS 0 ${machineNumber} "${EXCLUSION_TYPE}" ${EXCLUSION_DATE} True`;
      await runExclusion(machineName, exclusionCommand);
      success.push({ machine: machineName, message: exclusionCommand });
    } catch (error) {
      errors.push({ machine: machineName, message: error.message });
    }
  }

  if (success.length) {
    let successText = success.reduce((prev, info) => {
      const { machine, message } = info;
      return `${prev} machine(${machine}) --> ${message} ✅\n`;
    }, '');

    successText = `😎 [runOldExclusionProcessJob] was successfully executed in the following machines:\n${successText}`;

    await postToSlack(SLACK_WEBHOOK_URL, successText);
  }

  if (errors.length) {
    let errorText = errors.reduce((prev, data) => {
      const { machine, message } = data;
      return `${prev} machine(${machine}):${message} 👀\n`;
    }, '');

    errorText = `💥 [runOldExclusionProcessJob] We had errors in the following machines:\n${errorText}`;

    await postToSlack(SLACK_WEBHOOK_URL, errorText);
  }
}

console.log('Generating [Old Exclusion tasks] Process job');

const runOldExclusionProcessJob = new CronJob({
  cronTime: EXCLUSION_TASKS_CRON_EXP,
  onTick: exclusionProcess,
  start: true
});

runOldExclusionProcessJob.start();
