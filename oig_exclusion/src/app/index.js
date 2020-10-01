/**
 * This file is to get the OIG exclusion data of Month November 2018 for SINAI HEALTH 60-484.
 * 
 * Run this script we added the employees to database for appears on the views of report of Exclusions
 * @author Carlos Elguedo
 * @version 0.2.0
 */



//Utils dependence
const db = require('../db/index');
const moment = require('moment')


//Employees found on the file
let EmployeesWithExclusions = [];

//Global data
const EMPLOYER_ID = 484;

//Data of report generate
const DATE_REPORT = moment('2018-12-10').toDate('MM/dd/yyyy')
//Date of register added
const DATE_ADDED = moment('2018-12-14').toDate('MM/dd/yyyy')


const {exclusion_full_file_to_nov} = require('../files/oig_november')


const fs = require('fs');


//Function main of run this process
const main = async ()=>{

    console.log('\n\nTHE VERIFICATION EXCLUSION PROCESS TO EMPLOYER: ', EMPLOYER_ID)


    //Get the employers of database
    Employess = await getData()


    //Show message of total employee
    console.log('   Employees of employer to Process: ', Employess.length)

    //Control for the save records
    let saveCounter = 0

    //Get data from file
    const Exclusions_data = await exclusion_full_file_to_nov()
    // console.log(Exclusions_data)
    

    //Find the verify the matches
    //For each employee adde in the date of november and appears in the exclusion OIG_EMPLOYEES_CHECKED table
    //We made the process of verify on the file that contains the exclusion data
    for(let i = 0; i < Employess.length; i++){

        //Employee data
        const employee_id = Employess[i].PK_EMPLOYEE
        const first_name_employe = Employess[i].NM_FIRST.trim()
        const last_name_employe = Employess[i].NM_LAST.trim()
        const middle_name_employe = Employess[i].NM_MIDDLE === null? '': Employess[i].NM_MIDDLE
        const employee_number = Employess[i].ID_EMPLOYEE_NUMBER

        //Show message of verify 
        console.log(`       verifying employee: ${Employess[i].NM_FIRST}${Employess[i].NM_MIDDLE === null? ' ':Employess[i].NM_MIDDLE+' '}${Employess[i].NM_LAST}`)

        //For each exclusion in the file we made the comparation of employee data
        for(let j = 0; j < Exclusions_data.length; j++){
            //Info of exclusion
            const data_json = JSON.stringify(Exclusions_data[j])
            const exclusion = JSON.parse(data_json)

            //Exclusion info
            const exclusion_firt_name = exclusion.FIRSTNAME.trim()
            const exclusion_last_name = exclusion.LASTNAME.trim()
            const exclusion_middle_name = exclusion.MIDNAME.trim()
            const exclusion_profession = exclusion.SPECIALTY.trim()
            const exclusion_address = exclusion.ADDRESS.trim()
            const exclusion_dob = exclusion.DOB
            const exclusion_zip = exclusion.ZIP
            const exclusion_state = exclusion.STATE
            const exclusion_city = exclusion.CITY
            const exclusion_date = exclusion.EXCLDATE
            const exclusion_type = exclusion.EXCLTYPE
            
            //Converting Date of exclusions 
            let dob_date = moment(exclusion_dob).toDate('MM/dd/yyyy')
            let exc_date = moment(exclusion_date).toDate('MM/dd/yyyy')

            //Validate the info of employee with the info  get in the file
            if(
                exclusion_firt_name === first_name_employe &&
                exclusion_last_name === last_name_employe
                &&
                (
                    exclusion_middle_name === middle_name_employe ||
                    ((exclusion_middle_name === '') &&  (middle_name_employe === ''))
                )
            ){
                console.log(`       Employee Found: ${last_name_employe}-${first_name_employe}-${middle_name_employe}| DATA FOUND: |${exclusion_last_name}-${exclusion_firt_name}-${exclusion_middle_name}`)

                let QueryMatches = {
                    PK_EMPLOYEE:employee_id,
                    ID_EMPLOYEE_NUMBER:employee_number,
                    NM_FIRST:exclusion_firt_name,
                    NM_MIDDLE:exclusion_middle_name,
                    NM_LAST:exclusion_last_name,
                    DT_UPDATED:DATE_REPORT,
                    DS_PROFESSION:exclusion_profession,
                    DS_ADDRESS:exclusion_address,
                    DT_DOB:dob_date,
                    DS_ZIP:exclusion_zip,
                    DS_CITY:exclusion_city,
                    CD_STATE:exclusion_state,
                    CD_EXCLUSION_TYPE:exclusion_type,
                    DT_EXCLUSION:exc_date,
                    DT_PROCESSED: DATE_ADDED,
                    ID_EXCLUSION_REPORT:0
                }
                saveCounter++
                EmployeesWithExclusions.push(QueryMatches)
                //console.log(QueryMatches)

            }//End validate employee data

        }//End for each exclusions

        
    }//End for each employee

    //Condition to save data on BD
    if(saveCounter > 0){

        //Show total of data to save
        console.log('*********** Save Data found on BD ***********\n        Length of Data to save: ' + EmployeesWithExclusions.length)

            try{

                //A.    Save the data of report on OIG_EXCLUSIONS_REPORT
                let id_exclusion_report = await getIdReport(DATE_REPORT, EMPLOYER_ID)
    
                //IF EXIST A PREVIOUSLY ID SAVE ON BD, WE TAKE IT
                if(id_exclusion_report.length > 0){
                    console.log('   The employer have a register')
    
                    id_exclusion_report = id_exclusion_report[0].ID_EXCLUSION_REPORT
    
                }else{
                    console.log('   The employer do not have a register')
    
                    //We take of last value saved
                    let id_newExclusionReport = await getLastidToReport()
    
                    //Ajusted the new id to save
                    id_newExclusionReport = id_newExclusionReport[0].ID_REPORT+3
    
                    //We take this, to get the data with format to be saved
                    const dataToSave = await buildDataReport(DATE_REPORT, DATE_ADDED, EMPLOYER_ID, id_newExclusionReport, EmployeesWithExclusions.length)
    
                    //Save the data of report
                    await saveReportOIG(dataToSave)
    
                    //Asign the new value to variable 'id_exclusion_report'
                    id_exclusion_report = id_newExclusionReport
                }
                
    
                //B.    Save the data of employee on OIG_EXCLUSIONS_MATCH
                for(employee of EmployeesWithExclusions){
                    employee.ID_EXCLUSION_REPORT = id_exclusion_report
                }

                //For each 50 record
                let employeesBatch = [];
                let countOfEmployeeToSave = 0, totalBatch = 0;
                
                for(let i = 0; i < EmployeesWithExclusions.length; i++){
                  employeesBatch.push(EmployeesWithExclusions[i])
                  countOfEmployeeToSave++

                  //If the limit of batch is reached, or the count is the max record number; then save the records
                  if(countOfEmployeeToSave === 50 || (i+1) === EmployeesWithExclusions.length){
                    countOfEmployeeToSave = 0
                    totalBatch++
                    await saveEmployeeWithOIGMatch(employeesBatch, totalBatch)
                    employeesBatch = []
                  }
                }
            }catch(error){
                console.log('An Error has ocurred in the process:\n', error)
            }
        
    }//End of save register
    
    console.log('\n\nThe program has finished!')
}//End of main function



/**
 * This function is to get the employees that are going to verify
 */
const getData = async ()=>{
    
    //Get data from BD between the date range
    const data = (await getEmployeesList(moment('2018-01-11').toDate(), moment('2018-11-30').toDate(), EMPLOYER_ID))

    return data;
}



//Employer repository
/**
 * This function is to save info of report OIG to the employer
 * @param {*} reportinfo 
 */
const saveReportOIG = (reportinfo)=>{
    
    let row = {
      ...reportinfo
    }
    //console.log(row)
    let utils = new Utils(fs); 
    let file = "./src/files/result/reportOIG_record.txt"
    let insert = `INSERT INTO OIG_EXCLUSIONS_REPORT (ID_EXCLUSION_REPORT,DT_REPORT,ID_EMPLOYER,AM_RESULTS,AM_POSSIBLE_MATCHES,DS_COMMENTS,DT_ADDED) values (${row.ID_EXCLUSION_REPORT}, to_date('${moment(row.DT_REPORT).format("MM/DD/YYYY")}', 'MM/DD/YYYY'), ${row.ID_EMPLOYER}, ${row.AM_RESULTS}, ${row.AM_POSSIBLE_MATCHES}, '${row.DS_COMMENTS}', to_date('${moment(row.DT_ADDED).format("MM/DD/YYYY")}', 'MM/DD/YYYY'));`

    utils.write(file, insert, function (err) {
      if (err) {
        console.log("File not saved! " + err)
      }
      console.log("Record saved in the file")
    });
    //return db('OIG_EXCLUSIONS_REPORT').insert(row)    
  
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
  const buildDataReport = (DT_REPORT, DT_ADDED, ID_EMPLOYER, id_report, am_results/*, am_possible*/)=>{
      return {
        ID_EXCLUSION_REPORT: id_report,
        DT_REPORT: DT_REPORT,
        ID_EMPLOYER:ID_EMPLOYER,
        AM_RESULTS:am_results,
        AM_POSSIBLE_MATCHES:am_results/*am_possible*/,
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


//Employee Repository
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
      
  };


  /**
   * Employee batch to create record
   * @param {*} emp
   */
  const saveEmployeeWithOIGMatch = (employees, Batch)=>{
    
    
    let utils = new Utils(fs);
    let file = `./src/files/result/employees_${Batch}.txt`
    let insert = ''
    for(emp of employees){
      insert += `INSERT INTO OIG_EXCLUSIONS_MATCH (ID_MATCH,ID_EXCLUSION_REPORT,PK_EMPLOYEE,NM_FIRST,NM_MIDDLE,NM_LAST,ID_EMPLOYEE_NUMBER,DS_PROFESSION,DS_ADDRESS,DT_DOB,DS_ZIP,DS_CITY,CD_STATE,CD_EXCLUSION_TYPE,DT_EXCLUSION,IN_MATCH,DT_PROCESSED,DT_UPDATED) values (seq_oig_exclusions_match.nextval, ${emp.ID_EXCLUSION_REPORT}, ${emp.PK_EMPLOYEE}, '${emp.NM_FIRST}', '${emp.NM_MIDDLE}', '${emp.NM_LAST}', '${emp.ID_EMPLOYEE_NUMBER}', '${emp.DS_PROFESSION}', '${emp.DS_ADDRESS}', TO_DATE('${moment(emp.DT_DOB).format("MM/DD/YYYY")}', 'MM/DD/YYYY'), '${emp.DS_ZIP}', '${emp.DS_CITY}', '${emp.CD_STATE}', '${emp.CD_EXCLUSION_TYPE}', TO_DATE('${moment(emp.DT_EXCLUSION).format("MM/DD/YYYY")}', 'MM/DD/YYYY'), 0, TO_DATE('${moment(emp.DT_PROCESSED).format("MM/DD/YYYY")}', 'MM/DD/YYYY'), TO_DATE('${moment(emp.DT_UPDATED).format("MM/DD/YYYY")}', 'MM/DD/YYYY'));\n`
    }
    
      
    utils.write(file, insert, function (err) {
      if (err) {
        console.log("File employees not saved! " + err)
      }
      console.log("Record saved in the file")
    });
  }


  /**
   * Class to save of files
   */
  class Utils {

    constructor(fs) {
        this.fs = fs;
    }
    write(file, msg, handler) {
        this.fs.writeFile(file, msg, handler);
    }
  
  }


  
//To start the script
main()
