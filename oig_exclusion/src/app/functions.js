const fs = require('fs');
const csv = require('csv-parse');

module.exports.getDB = async filePath => {
  return new Promise(async (resolve, reject) => {
    try {
      let parser = csv({ columns: true }, (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(data);
      });
      fs.createReadStream(filePath, { encoding: 'utf8', autoClose: true }).pipe(
        parser
      );
    } catch (error) {
      reject(error);
    }
  });
};

