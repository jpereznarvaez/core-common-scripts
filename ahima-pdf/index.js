const fs = require("fs");
const Nightmare = require("nightmare");
const axios = require("axios");
const FormData = require("form-data");
require("nightmare-inline-download")(Nightmare);
const util = require("util");
const execFile = util.promisify(require("child_process").execFile);

const fileCsv = process.argv[2];
const now = new Date().toJSON();
const fileLog = `./files/log.txt`;
const scriptSql = `./files/script_update_screenshot.txt`;

init = async () => {
    const path = `./files/${fileCsv}`;
    if (fs.existsSync(path)) await getFileData(fileCsv);
    else console.log("file no exist");
};

getFileData = async fileCsv => {
    fs.readFile(`./files/${fileCsv}`, "utf8", async (err, data) => {
        try {
            if (data) {
                data = data.split("\n");
                addLogMessage(`--------------------${now}--------------------`);
                for (const row of data) {
                    let information = row.split(",");
                    if (information.length && information[0] != "")
                        await getLicenseInformation(information);
                }
            }
        } catch (error) {
            fs.writeFile(fileLog, data);
        }
    });
};

getLicenseInformation = async information => {
    let lastName = information[1];
    let licenseNumber = information[2];
    let documentId = information[0];
    let fileName = information[3].replace(".JPG", ".pdf");
    let filePath = `${__dirname}\\files\\pdf\\${fileName}`;
    let reportDate = information[4];
    try {
        if (!fs.existsSync(filePath)) {
            const nightmare = Nightmare({ show: false, waitTimeout: 5000 });
            await nightmare
                .goto(
                    "https://my.ahima.org/certification/credentialverification.aspx"
                )
                .wait("#phContent_txtLastName")
                .type("#phContent_txtLastName", lastName)
                .type("#phContent_txtCredentialNum", licenseNumber)
                .click("#phContent_btnSubmit")
                .wait(2000)
                .evaluate(licenseNumber => {
                    if (!document.querySelector("#phContent_lblNoResults")) {
                        return document.querySelector(
                            "#ctl00_phContent_SearchResultsRadGrid_ctl00 > tbody > tr"
                        ).innerHTML;
                    }
                }, licenseNumber)
                .end()
                .then(async licenseData => {
                    if (licenseData) {
                        generatePdf({
                            licenseData,
                            filePath,
                            fileName,
                            reportDate,
                            documentId
                        });
                    }
                    addLogMessage({
                        lastName,
                        licenseNumber,
                        msg: result.path
                    });
                })
                .catch(error => {
                    addLogMessage({
                        lastName,
                        licenseNumber,
                        msg: JSON.stringify(error)
                    });
                });
        }
    } catch (error) {
        addLogMessage({
            lastName,
            licenseNumber,
            msg: JSON.stringify(error)
        });
    }
};

generatePdf = async props => {
    const { filePath, fileName, licenseData, reportDate, documentId } = props;
    try {
        const nightmare = Nightmare({
            show: false,
            waitTimeout: 5000
        });
        await nightmare
            .goto(`file://${__dirname}/files/template.html`)
            .wait(".header")
            .evaluate(
                (licenseData, reportDate) => {
                    document.querySelector(
                        "#report-date"
                    ).innerText = reportDate;
                    document.querySelector("#result").innerHTML = licenseData;
                    return document.body.innerHTML;
                },
                licenseData,
                reportDate
            )
            .wait(1000)
            .end()
            .pdf(filePath)
            .then(async () => {
                const { stdout } = await execFile("exiftool.exe", [
                    "-Title=AHIMA",
                    filePath
                ]);
                console.log(fileName, stdout);
                fs.readFile(filePath, (err, imageData) => {
                    if (imageData) {
                        const form = new FormData();
                        form.append("file", imageData, {
                            filepath: filePath,
                            contentType: "application/pdf"
                        });
                        axios
                            .post("https://s3.evercheck.com/Evercheck", form, {
                                headers: form.getHeaders()
                            })
                            .then(response => {
                                addSql(
                                    documentId,
                                    JSON.stringify(response.data)
                                );
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    }
                });
            })
            .catch(error => {
                console.log("error", error);
            });
    } catch (error) {
        console.log("error", error);
    }
};

addLogMessage = (data, type = 0, isOk = false) => {
    const { lastName, licenseNumber, msg } = data;
    switch (type) {
        case 0:
            fs.appendFile(fileLog, `${JSON.stringify(data)}\n`);
            break;
        case 1:
            fs.appendFile(
                fileLog,
                `${lastName},${licenseNumber},${isOk},${now},${msg}${"\n"}`
            );
            break;
        default:
            break;
    }
};

addSql = (documentId, token) => {
    const sql = `UPDATE document_index SET cd_token = ${token} WHERE id_document = "${documentId}";\n`;
    fs.appendFile(scriptSql, sql);
};

init();
