'use strict';
require('dotenv').config();
const CronJob = require('cron').CronJob;
const { restartTaskOldLVProcess } = require('./worker');
const { RESTART_TASKS_CRON_EXP } = process.env;

if (!RESTART_TASKS_CRON_EXP)
  return console.error('Missing [RESTART_TASKS_CRON_EXP] variable!!!!!');

console.log('Generating [Restart Old LV tasks] Process job');

const restartTaskOldLVJob = new CronJob({
  cronTime: RESTART_TASKS_CRON_EXP,
  onTick: restartTaskOldLVProcess,
  start: true
});

restartTaskOldLVJob.start();
