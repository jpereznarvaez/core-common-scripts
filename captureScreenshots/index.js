//Histories info, this export is from PT,
//because the screenshot shold be captured by history, not by license number
const filePathExportByHistories = 'storage/fullDataByHistories.json';
//Some data is not provided by PT, so we have to verify this licences and late,
//do a export of lv_verified_license, and late convert the export to json.
const filePathExportVerifiedData = 'storage/exportFromVerifiedData.json';
const { readJson, getJsonToScreenshot } = require('./utils/functions');
const puppeteerUtils = require('./puppeteerUtils');
const { captureScreenshots } = require('./screenshots');
const fs = require('fs');

(async () => {
  const jsonByHistories = await readJson(filePathExportByHistories);
  const jsonVerifiedData = await readJson(filePathExportVerifiedData);

  const jsonInfoToTakeScreenshot = await getJsonToScreenshot(
    jsonByHistories,
    jsonVerifiedData
  );

  let countOfScreenthot = 0;
  for (const screenshotInfo of jsonInfoToTakeScreenshot) {
    const screenshotCaptured = await captureScreenshots(
      puppeteerUtils,
      screenshotInfo
    );

    countOfScreenthot++;
    console.log(screenshotCaptured);
  }

  let jsonToWrite = JSON.stringify(jsonInfoToTakeScreenshot);

  fs.writeFileSync('storage/screenshotsCaptured.json', jsonToWrite, 'utf8');

  console.log('storage/screenshotsCaptured.json created successfully.');
  console.log(`${countOfScreenthot} screenshots captured`);
})();
