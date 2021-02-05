'use strict';
require('dotenv').config();
const CronJob = require('cron').CronJob;
const { removeInactiveLicensesProcess } = require('./worker');
const { INACTIVE_LICENSES_CRON_EXP } = process.env;

if (!INACTIVE_LICENSES_CRON_EXP)
  return console.error('Missing [INACTIVE_LICENSES_CRON_EXP] variable!!!!!');

console.log('Generating [REMOVE INACTIVE LICENSES] Process job');

const removeInactiveLicensesJob = new CronJob({
  cronTime: INACTIVE_LICENSES_CRON_EXP,
  onTick: removeInactiveLicensesProcess,
  start: true
});

removeInactiveLicensesJob.start();
