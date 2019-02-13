const db = require('../db/index');
  

/**
 * This function is to save info of report OIG to the employer
 * @param {*} reportinfo 
 */
const saveReportOIG = (reportinfo)=>{
    
  let row = {
    ...reportinfo
  }
  return db('OIG_EXCLUSIONS_REPORT').insert(row)    

}


/**
 * This function is to get the last id saved on BD to the OIG_EXCLUSIONS_REPORT
 * @param {*} DT_REPORT 
 * @param {*} ID_EMPLOYER 
 */
const getIdReport = (DT_REPORT, ID_EMPLOYER)=>{
    
  return db
  .select('ID_EXCLUSION_REPORT')
  .from('OIG_EXCLUSIONS_REPORT')
  .where('DT_REPORT', DT_REPORT)
  .where('ID_EMPLOYER', ID_EMPLOYER)
  .limit(1);

}

/**
 * This function is to converted the data to json format and to be saved
 * @param {*} DT_REPORT 
 * @param {*} DT_ADDED 
 * @param {*} ID_EMPLOYER 
 * @param {*} id_report 
 */
const buildDataReport = (DT_REPORT, DT_ADDED, ID_EMPLOYER, id_report)=>{
    return {
      ID_EXCLUSION_REPORT: id_report,
      DT_REPORT: DT_REPORT,
      ID_EMPLOYER:ID_EMPLOYER,
      AM_RESULTS:null,
      AM_POSSIBLE_MATCHES:null,
      DS_COMMENTS:'',
      DT_ADDED: DT_ADDED

    }
}

/**
 * This function is to get the last id saved on BD to the OIG_EXCLUSIONS_REPORT
 * Return the max id value
 */
const getLastidToReport = ()=>{
    return db
    .max('ID_EXCLUSION_REPORT AS ID_REPORT')
    .from('OIG_EXCLUSIONS_REPORT')
}

module.exports = {
    saveReportOIG,
    getIdReport,
    buildDataReport,
    getLastidToReport
}