const db = require('../db/index');

/**
 * This process is to get the employees that are going to be verified
 * @param {*} dtInitial 
 * @param {*} dtFinal 
 * @param {*} id_employer 
 */
const getEmployeesList = (dtInitial, dtFinal, id_employer) => {

    return db
      .select('EMP.PK_EMPLOYEE', 'EMP.ID_EMPLOYEE_NUMBER', 'EMP.NM_FIRST', 'EMP.NM_MIDDLE', 'EMP.NM_LAST')
      .from('EMPLOYEE AS EMP')
      .innerJoin('OIG_EMPLOYEES_CHECKED AS OIG', 'OIG.PK_EMPLOYEE', '=', 'EMP.PK_EMPLOYEE')
      .where('EMP.ID_EMPLOYER', id_employer)
      .whereBetween('OIG.DT_ADDED',  [dtInitial, dtFinal])
      .limit(10000);
      
  };


  /**
   * 
   * @param {*} employeeInfo 
   */
  const saveEmployeeWithOIGMatch = (employeeInfo)=>{
    
    let row = {
      ...employeeInfo
    }

    return db('OIG_EXCLUSIONS_MATCH').insert(row)
  }


  module.exports = {
    getEmployeesList,
    saveEmployeeWithOIGMatch
  }