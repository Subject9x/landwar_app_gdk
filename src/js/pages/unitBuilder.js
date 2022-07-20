/*
    Javascript layer for page: UnitBuilder
*/
function ub_control_sheet_new(){
    window.api.send('ub-open-sheet-new');
}

function ub_control_sheet_import(){
    window.api.send('ub-open-sheet-import', dialogLoadOptionsUnitList);
    
    console.log(window);    //debug
    console.log(window.api);
}