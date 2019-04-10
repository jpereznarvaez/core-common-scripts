const axios = require('axios');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const moment = require('moment');

const storageUrl = 'http://localhost:3020/verifyLicense';
const errorFile = path.join(__dirname, 'errors.txt');
const okFile = path.join(__dirname, 'ok.txt');

async function getDataFromXlsx(
  fileName,
  sheetName,
  initRow,
  finalRow,
  sqlFileName
) {
  const workbook = XLSX.readFile(`./excelFiles/${fileName}`);
  const worksheet = workbook.Sheets[sheetName];

  for (let i = initRow; i <= finalRow; i++) {
    let xlsxRowIten = {
      licenseNumber: worksheet[`C${i}`].v,
      cdProfession: worksheet[`A${i}`].v,
      stateId: worksheet[`B${i}`].v
    };

    console.log(
      i +
        '. Working on ' +
        xlsxRowIten.cdProfession +
        ' ' +
        xlsxRowIten.licenseNumber
    );

    // await uploadImgFromFolder(sqlFileName, xlsxRowIten);
  }
}

async function uploadImgFromFolder(sqlFileName, item) {
  await axios
    .post(storageUrl, {
      stateId: item.stateId,
      professionCode: item.cdProfession,
      licenseNumber: item.licenseNumber
    })
    .then(res => {
      if (res) {
        console.log('Storage Worked!');

        if (!res.data.inFound) {
          saveError(`${item.cdProfession} | ${item.licenseNumber} - NOT FOUND`);
        } else {
          saveError(`${item.cdProfession} | ${item.licenseNumber} - FOUND`);
        }
      }
    })
    .catch(e => {
      console.log(e);
      saveError(
        `${item.cdProfession} | ${item.licenseNumber} - Error ${
          e.response.data.message
        }`
      );
    });
}

function saveError(errorMessage) {
  fs.appendFileSync(
    errorFile,
    `${moment(new Date()).format(
      'MMMM Do YYYY, h:mm:ss a'
    )}: ${errorMessage} \n`
  );
}

getDataFromXlsx(
  'az_nm_nursys.xlsx',
  'az_nm_nursys',
  1,
  335,
  'update_bad_screenshots_nm_az_nursys.sql'
);
