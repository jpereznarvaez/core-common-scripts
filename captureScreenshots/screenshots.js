module.exports.captureScreenshots = async (puppeteer, ScreenshotInfo) => {
  let page;

  try {
    page = await puppeteer.getNewPage();

    await page.setViewport({
      width: 700,
      height: 800
    });

    await page.goto(`file://${__dirname}/template/page.html`);
    await page.evaluate(info => {
      let dateFormat = date => {
        var today = new Date(date);
        var dd = today.getDate(date);
        var mm = today.getMonth(date) + 1; //January is 0!

        var yyyy = today.getFullYear();
        if (dd < 10) {
          dd = '0' + dd;
        }
        if (mm < 10) {
          mm = '0' + mm;
        }
        var today = mm + '/' + dd + '/' + yyyy;
        return today;
      };

      for (let key in info) {
        let element = document.querySelector(`#${key}`);
        let isDate = !isNaN(new Date(info[key]));

        if (isDate) element.innerText = dateFormat(info[key]);
        else element && (element.innerText = info[key]);
      }
    }, ScreenshotInfo);

    await page.waitForFunction(() => {
      let veridicationDate = document.querySelector('#DT_ADDED');
      if (!veridicationDate || veridicationDate.innerText === '') return false;
      return true;
    });

    await page.screenshot({ path: `${ScreenshotInfo.PATH}` });
  } finally {
    if (page) {
      await page.close();
      return `${ScreenshotInfo.PATH} captured.`;
    }
  }
};
