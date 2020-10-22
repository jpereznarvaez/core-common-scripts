const axios = require('axios');
require('dotenv').config({ path: __dirname + '/.env' })

const {
  SCRAPING_URL,
  CONCURRENCY
} = process.env;

const payload = [
  {
    licenseNumber: '205509134811',
    professionCode: 'BLS',
    stateId: 56
  }
];
let successRequest = 0,
  errorRequests = 0;

const post = async (iterator, url, body) => {
  try {
    const {
      data: { inFound = null, webLicenseInfo }
    } = await axios.post(url, body);

    console.log({
      no: iterator,
      state: body.stateId,
      professionCode: body.professionCode,
      response: {
        webLicenseInfo,
        inFound
      }
    });

    successRequest++;
  } catch (error) {
    console.log({
      no: iterator,
      state: body.stateId,
      professionCode: body.professionCode,
      error: error.response ? error.response.data.message : error
    });
    errorRequests++;
  }
};

var arr = [];
for (let i = 0; i < CONCURRENCY; i++) {
  arr.push(post(iterator = i, SCRAPING_URL, payload[Math.floor(Math.random() * payload.length)]));
}

console.time('Duration');
Promise.all(arr)
  .then(values => {
    console.info(`Total: ${values.length}`);
    console.timeEnd('Duration');
    console.log(`${(successRequest * 100) / CONCURRENCY}% - ✅ ${successRequest} / ❌ ${errorRequests}`);
  })
  .catch(err => console.error(err));