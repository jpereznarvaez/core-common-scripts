const fs = require('fs');
const moment = require('moment');

const readJson = filePath => {
  return new Promise((resolve, reject) => {
    try {
      let rawdata = fs.readFileSync(filePath);
      let json = JSON.parse(rawdata);
      resolve(json);
    } catch (error) {
      reject(error);
    }
  });
};

const getJsonToScreenshot = (jsonByHistories, jsonVerifiedData) => {
  return new Promise((resolve, reject) => {
    try {
      for (const screenshotInfo of jsonByHistories) {
        for (const jsonVerified of jsonVerifiedData) {
          if (
            screenshotInfo.DS_LICENSE_NUMBER == jsonVerified.DS_LICENSE_NUMBER
          ) {
            let date = screenshotInfo.DT_ADDED.split(' ');

            screenshotInfo.FULL_NAME =
              jsonVerified.NM_LAST + ', ' + jsonVerified.NM_FIRST;

            screenshotInfo.CD_NURSYS_LIC_ACTIVE =
              jsonVerified.CD_NURSYS_LIC_ACTIVE;

            screenshotInfo.CD_LICENSE_STATUS = jsonVerified.CD_LICENSE_STATUS;

            screenshotInfo.CD_NURSYS_COMPACT_STATUS =
              jsonVerified.CD_NURSYS_COMPACT_STATUS;

            screenshotInfo.DT_ORIG_ISSUE = jsonVerified.DT_ORIG_ISSUE;
            screenshotInfo.DT_STATUS = jsonVerified.DT_STATUS;

            screenshotInfo.DT_ADDED = moment(date[0], 'MM/DD/YYYY').format(
              'MM/DD/YYYY'
            );

            let dt_added_format = moment(date[0], 'MM/DD/YYYY').format(
              'MMDDYYYY'
            );

            screenshotInfo.PATH = `screenshots/${screenshotInfo.CD_STATE}_${
              screenshotInfo.CD_PROFESSION
            }_${screenshotInfo.DS_LICENSE_NUMBER}_${dt_added_format}.jpg`;
          }
        }
      }

      resolve(jsonByHistories);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { readJson, getJsonToScreenshot };
