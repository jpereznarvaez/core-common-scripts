const axios = require('axios');
const serviceUrl = 'https://oldlv.evercheck.com/';

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

const lvMachines = (process.argv[2] && [`${process.argv[2]}`]) || allMachines;

function status(machine) {
  return axios.get(`${serviceUrl}${machine}/`);
}

const waiting = delay =>
  new Promise(function (resolve) {
    setTimeout(resolve, delay);
  });

(async function () {
  for (const machine of lvMachines) {
    try {
      await status(machine);
      console.log(`Status machine(${machine}):OK`);
      await waiting(500);
    } catch (error) {
      console.error(`Status machine(${machine}):ERROR:${error.message}`);
    }
  }
})();
