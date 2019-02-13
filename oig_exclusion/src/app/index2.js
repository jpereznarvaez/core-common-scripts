/**
 * This file is to get the OIG exclusion data of Month November 2018 for SINAI HEALTH 60-484.
 * 
 * Run this script we added the employees to database for appears on the views of report of Exclusions
 * @author Carlos Elguedo
 * @version 0.1.0
 */


const db = require('../db/index');
const moment = require('moment')

//The function to get the data with exclusions
// const {getDB} = require('./functions')
// const {exclusion_november} = require('./files/exclusion_november')
const {exclusion_november} = require('../files/noviembre_suplements')
const {exclusion_full_file_nov} = require('../files/oig_november')

//Employees found on the file
let EmployeesWithExclusions = [];

//Global data
const EMPLOYER_ID = 5;

//Data of report generate
const DATE_REPORT = moment('2018-12-10').toDate('MM/dd/yyyy')
//Date of register added
const DATE_ADDED = moment('2018-12-14').toDate('MM/dd/yyyy')


//Function main of run this process
const main = async ()=>{

    console.log('\n\nTHE VERIFICATION EXCLUSION PROCESS TO EMPLOYER: ', EMPLOYER_ID)


    //Get the employers of database
    Employess = await getData()

    //Show message of total employee
    console.log('   Employees of the employer to Process: ', Employess.length)

    //Control for the save records
    let saveCounter = 0

    //Get data from file
    // const Exclusions_data = await getDB('src/files/OIG_Current_Monthly_Supplements_NOVEMBER.csv')
    const Exclusions_data = await exclusion_full_file_nov()
    
    
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
                console.log(`Employee Found: ${last_name_employe}-${first_name_employe}-${middle_name_employe}| DATA FOUND: |${exclusion_last_name}-${exclusion_firt_name}-${exclusion_middle_name}`)

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

        //
        console.log('If you are not sure about saving the records, please cancel this script [Ctrl + C]. You have 2 minutes to cancel, if you are sure, please wait for the two minutes to end')
        let cancel = await timeOutToCancelProgram(true, 120000)

        //console.log('Return: ', cancel)

        if(cancel){
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
                    id_newExclusionReport = id_newExclusionReport[0].ID_REPORT+1
    
                    //We take this, to get the data with format to be saved
                    const dataToSave = await buildDataReport(DATE_REPORT, DATE_ADDED, EMPLOYER_ID, id_newExclusionReport)
    
                    //Save the data of report
                    await saveReportOIG(dataToSave)
    
                    //Asign the new value to variable 'id_exclusion_report'
                    id_exclusion_report = id_newExclusionReport
                }
                
    
                //B.    Save the data of employee on OIG_EXCLUSIONS_MATCH
                for(employee of EmployeesWithExclusions){
    
                    employee.ID_EXCLUSION_REPORT = id_exclusion_report
    
                    await saveEmployeeWithOIGMatch(employee)
    
                    console.log('   Saved record on BD')
                }
    
                saveCounter = 0
                EmployeesWithExclusions = []
            }catch(error){
                console.log('An Error has ocurred in the process:\n', error)
            }
        }//End Condition to continue
        
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




/**
 * If the user wants to cancel the saving of this data, he can press cancel, before the estimated time expires
 * @param {*} x value to compare
 * @param {*} time time of delay
 */
function timeOutToCancelProgram(x, time) { 
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(x);
      }, time);
    });
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

//To start the script
main()
