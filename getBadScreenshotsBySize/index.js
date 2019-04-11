const axios = require('axios');
const listScreenshots = require('./storage/list_screenshots.json');
const fs = require('fs');
const storageUrlProd = 'https://s3.evercheck.com/evercheck/';
const storageUrlTest = 'https://test.storages3.evercheck.com/evercheck/';

const storage = async token => {
  try {
    let response = await axios.get(`${storageUrlProd}${token}`);

    return response.headers['content-length'];
  } catch (err) {
    console.error(err);
  }
};

(async () => {
  let badScreenshotsFound = 0;

  let getBadScreenshots = new Promise(async (resolve, reject) => {
    try {
      var jsonBadScreenshots = {
        badScreenshots: []
      };

      for (const badScreenshot of listScreenshots) {
        let contentLength = await storage(badScreenshot.CD_TOKEN);

        //Finding bad screenshots by size (13124)
        if (contentLength <= 13124) {
          jsonBadScreenshots.badScreenshots.push({
            ID_EMPLOYEE_LIC_HISTORY: badScreenshot.ID_EMPLOYEE_LIC_HISTORY,
            CD_TYPE: badScreenshot.CD_TYPE,
            DS_LICENSE_NUMBER: badScreenshot.DS_LICENSE_NUMBER,
            CD_STATE: badScreenshot.CD_STATE,
            DS_STATE: badScreenshot.DS_STATE,
            CD_PROFESSION: badScreenshot.CD_PROFESSION,
            NM_PROFESSION: badScreenshot.NM_PROFESSION,
            CD_TOKEN: badScreenshot.CD_TOKEN,
            DT_ADDED: badScreenshot.DT_ADDED,
            DS_FILENAME: badScreenshot.DS_FILENAME,
            SIZE: contentLength
          });
          console.log(
            'Bad screenshot found => Token:',
            badScreenshot.CD_TOKEN,
            'License:',
            badScreenshot.DS_LICENSE_NUMBER,
            'History:',
            badScreenshot.ID_EMPLOYEE_LIC_HISTORY
          );
          badScreenshotsFound++;
        }
      }
      resolve(jsonBadScreenshots);
    } catch (error) {
      reject(error);
    }
  });

  try {
    var arrayBadScreenshots = await getBadScreenshots;

    var json = JSON.stringify(arrayBadScreenshots);
    fs.writeFileSync('storage/badScreenshots.json', json, 'utf8');

    console.log('badScreenshots.json created');
    console.log(
      'The process has been completed',
      badScreenshotsFound,
      'bad screenshots found'
    );
  } catch (error) {
    console.log(error);
  }
})();
