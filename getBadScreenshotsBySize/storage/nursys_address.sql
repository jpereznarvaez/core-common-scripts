--------------------------------------------------------------------------------
--NURSYS webservice
--------------------------------------------------------------------------------
--Variables
set define off
declare 
        --states
        vnew_mexico         state.id_state%type;
        varizona            state.id_state%type;

        
        --boards
        vnm_nursing         board.id_board%type;
        vaz_nursing         board.id_board%type;
            
begin
    
    --*****************************************************************************
    --VARIABLES OF NURSYS WEBSERVICES 
    --*****************************************************************************
    --States
    varizona := 4;
    vnew_mexico := 28;

    --Boards
    select
        max(case when nm_board = 'Arizona State Board of Nursing (Nursys)' then id_board else 0 end) as az_nursing,
        max(case when nm_board = 'New Mexico Board of Nursing' then id_board else 0 end) as nm_nursing

    into vaz_nursing, vnm_nursing
    from board
    where id_state in (varizona, vnew_mexico);

    --------------------------------------------------------------------------------------
    -- Lv Dev Team 60-58
    --------------------------------------------------------------------------------------
    --New-Mexico
    insert into lv_employer_parameter (id_employer, id_state, id_board, cd_type, ds_value)
    values (58, vnew_mexico, vnm_nursing, 'EMPLOYER_ADDRESS', '1123 W. Murray Dr. 6th St');
    
    insert into lv_employer_parameter (id_employer, id_state, id_board, cd_type, ds_value)
    values (58, vnew_mexico, vnm_nursing, 'EMPLOYER_ADDRESS2', '');
    
    insert into lv_employer_parameter (id_employer, id_state, id_board, cd_type, ds_value)
    values (58, vnew_mexico, vnm_nursing, 'EMPLOYER_CITY', 'Farmington');
    
    insert into lv_employer_parameter (id_employer, id_state, id_board, cd_type, ds_value)
    values (58, vnew_mexico, vnm_nursing, 'EMPLOYER_STATE', 'NM');
    
    insert into lv_employer_parameter (id_employer, id_state, id_board, cd_type, ds_value)
    values (58, vnew_mexico, vnm_nursing, 'EMPLOYER_ZIP', '87401');
    
    insert into lv_employer_parameter (id_employer, id_state, id_board, cd_type, ds_value)
    values (58, vnew_mexico, vnm_nursing, 'EMPLOYER_EMAIL', 'angie@evercheck.com');

    --Arizona
    insert into lv_employer_parameter (id_employer, id_state, id_board, cd_type, ds_value)
    values (58, varizona, vaz_nursing, 'EMPLOYER_ADDRESS', '1601 W St Marys Rd');
    
    insert into lv_employer_parameter (id_employer, id_state, id_board, cd_type, ds_value)
    values (58, varizona, vaz_nursing, 'EMPLOYER_ADDRESS2', '');
    
    insert into lv_employer_parameter (id_employer, id_state, id_board, cd_type, ds_value)
    values (58, varizona, vaz_nursing, 'EMPLOYER_CITY', 'Tucson');
    
    insert into lv_employer_parameter (id_employer, id_state, id_board, cd_type, ds_value)
    values (58, varizona, vaz_nursing, 'EMPLOYER_STATE', 'AZ');
    
    insert into lv_employer_parameter (id_employer, id_state, id_board, cd_type, ds_value)
    values (58, varizona, vaz_nursing, 'EMPLOYER_ZIP', '85745');
    
    insert into lv_employer_parameter (id_employer, id_state, id_board, cd_type, ds_value)
    values (58, varizona, vaz_nursing, 'EMPLOYER_EMAIL', 'angie@evercheck.com');

 commit;
end;