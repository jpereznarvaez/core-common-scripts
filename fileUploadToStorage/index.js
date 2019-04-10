const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const axios = require('axios');
const moment = require('moment');
const FormData = require('form-data');

const errorFile = path.join(__dirname, 'errors.txt');
const storageUrlProd = 'https://s3.evercheck.com/evercheck';
const storageUrlTest = 'https://test.storages3.evercheck.com/evercheck';

function saveError(errorMessage) {
  fs.appendFileSync(
    errorFile,
    `${moment(new Date()).format(
      'MMMM Do YYYY, h:mm:ss a'
    )}: ${errorMessage} \n`
  );
}

async function getDataFromXlsx(
  fileName,
  sheetName,
  initRow,
  finalRow,
  sqlFileName
) {
  const workbook = XLSX.readFile(`./excelFiles/${fileName}`);
  const worksheet = workbook.Sheets[sheetName];

  var infoWorked = [];

  for (let i = initRow; i <= finalRow; i++) {
    let xlsxRowIten = {
      licenseNumber: worksheet[`C${i}`].v,
      fileName: path.join(__dirname, `imgToUpload`, worksheet[`H${i}`].v),
      name: worksheet[`H${i}`].v,
      idEmployeeLicHistory: worksheet[`A${i}`].v,
      oldToken: worksheet[`J${i}`].v,
      token: ''
    };

    console.log(i + '. Working on ' + xlsxRowIten.licenseNumber);

    if (fs.existsSync(xlsxRowIten.fileName)) {
      await uploadImgFromFolder(sqlFileName, xlsxRowIten);

      infoWorked.push(xlsxRowIten);
      let jsonToWrite = JSON.stringify(infoWorked);

      fs.writeFileSync('storage/workedData.json', jsonToWrite, 'utf8');
    } else {
      saveError(
        `${xlsxRowIten.licenseNumber} - No existe Archivo de Screenshot`
      );
      console.log(`No existe Archivo del Screenshot`);
    }
  }
}

function generateQueryUpdate(item) {
  return `update document_index set cd_token = '${
    item.token
  }' where ID_DOCUMENT = ${item.idEmployeeLicHistory} and CD_TOKEN = '${
    item.oldToken
  }' and CD_TYPE = 'LICENSE_VERIFIC'; \n`;
}

async function uploadImgFromFolder(sqlFileName, item) {
  return new Promise(async (resolve, reject) => {
    try {
      let imageData = fs.readFileSync(item.fileName);
      const form = new FormData();
      form.append('file', imageData, {
        filepath: item.fileName,
        contentType: 'image/jpeg'
      });
      let res = await axios.post(storageUrlProd, form, {
        headers: form.getHeaders()
      });
      console.log('Storage Worked!', item.name, ':', res.data);
      item.token = res.data;
      let queryUpdate = generateQueryUpdate(item);

      fs.appendFileSync(
        path.join(__dirname, 'sqlGenerated', sqlFileName),
        queryUpdate
      );
      resolve('Upload to storage process finish');
    } catch (error) {
      reject(error);
    }
  });
}

getDataFromXlsx(
  'FullDataByHistories.xlsx',
  'az_nm_nursys',
  2,
  378,
  'update_bad_screenshots_nm_az_nursys.sql'
);
//getDataFromXlsx(excel filename, excel sheet name, init row, final row, sql file name);
