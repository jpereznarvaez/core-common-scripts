const puppeteer = require('puppeteer');

async function evaluateFunction(url, fn, selectors) {
  let browser = null;

  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const results = await page.evaluate(fn, selectors);
    return results;
  } catch (error) {
    console.log(error);
  } finally {
    if (browser) browser.close();
  }
}

module.exports = { evaluateFunction };
