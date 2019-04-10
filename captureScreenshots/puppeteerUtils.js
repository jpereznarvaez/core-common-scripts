const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

let Browser;

const getBrowser = async () => {
  if (!Browser)
    Browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

  return Browser;
};

const getNewPage = async () => {
  Browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  let page = await Browser.newPage();

  let preloadFile = fs.readFileSync(
    path.resolve(__dirname, 'scriptsUtils.js'),
    'utf8'
  );

  await page.evaluateOnNewDocument(preloadFile);
  return page;
};

const validateSelectorText = (page, ...selectors) => {
  return page.evaluate(selectors => {
    for (const [selector, text, nodeType = 'innerText'] of selectors) {
      let element = document.querySelector(selector);
      let regex = new RegExp(text);

      if (element) {
        if (!element[nodeType].match(regex))
          throw new Error(
            `Web site might have change: selector *${selector}* expected *${text}* but got *${
              element[nodeType]
            }*`
          );
      } else {
        throw new Error(
          `Web site might have change: selector *${selector}* not found`
        );
      }
    }
  }, selectors);
};

const fullNameToObject = (fullName, format) => {
  switch (format) {
    case 'FIRST MIDDLE LAST':
      return fullNamesScripts.FML(fullName);

    default:
      throw new Error(`There is not name format like ${format} in our Utils`);
  }
};

const fullNamesScripts = {
  FML: fullName => {
    fullName = fullName.trim().split(' ');

    if (fullName.length === 1)
      throw new Error('NAME Format *FIRST MIDDLE LAST* might have changed');

    let name = {};
    name.first = fullName.shift();

    if (fullName.length > 1) {
      name.middle = fullName.shift();
      name.last = fullName.join(' ');
    } else name.last = fullName.shift();

    return name;
  }
};

module.exports = {
  getBrowser,
  getNewPage,
  validateSelectorText,
  fullNameToObject
};
