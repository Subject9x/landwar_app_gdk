/*
    Javascript layer for page: UnitBuilder
*/
const btnAddUnit = document.getElementById('btnAddUnit');

/*
    Binder functions for unitBuilder
*/

function ub_row_change_points(rowId){

    let sizeVal = parseInt(document.getElementById(rowId + '_size').value);
    let moveVal = parseInt(document.getElementById(rowId + '_move').value);
    let evadeVal = parseInt(document.getElementById(rowId + '_evade').value);
    let dmgMeleeVal = parseInt(document.getElementById(rowId + '_DMGM').value);
    let dmgRangeVal = parseInt(document.getElementById(rowId + '_DMGR').value);
    let rangeVal = parseInt(document.getElementById(rowId + '_range').value);
    let armorVal = parseInt(document.getElementById(rowId + '_armor').value);
    let structVal = parseInt(document.getElementById(rowId + '_structure').value);

    let sizeCost = uc_calc_Size(sizeVal);
    let moveCost = uc_calc_Move(moveVal, sizeVal);
    let evadeCost = uc_calc_Evade(evadeVal);
    let dmgMeleeCost = uc_calc_Damage_Melee(dmgMeleeVal, moveVal, sizeVal);
    let dmgRangeCost = uc_calc_Damage_Range(dmgRangeVal);
    let rangeCost = uc_calc_Range(moveVal, rangeVal, dmgRangeVal);
    let armorCost = uc_calc_Armor(armorVal, sizeVal);
    let structCost = uc_calc_Structure(structVal);
    
    /*console.log('-------------change-------------------');
    console.log('sizeCost= ' + sizeCost);
    console.log('moveCost= ' + moveCost);
    console.log('evadeCost= ' + evadeCost);
    console.log('dmgMeleeCost= ' + dmgMeleeCost);
    console.log('dmgRangeCost= ' + dmgRangeCost);
    console.log('rangeCost= ' + rangeCost);
    console.log('armorCost= ' + armorCost);
    console.log('structCost= ' + structCost);*/


    let pointsVal = uc_calc_baseCost(sizeCost, moveCost, evadeCost, dmgMeleeCost, dmgRangeCost, rangeCost, armorCost, structCost);
    document.getElementById(rowId+'_points').innerHTML =  Math.max(0, pointsVal);
}

function ub_row_on_change_event(event){
    let pointsId = event.srcElement.id.substring(0,event.srcElement.id.indexOf('_'));
    if(event.srcElement.max){
        let maxVal = parseInt(event.srcElement.max);
        let testVal = parseInt(event.srcElement.value);
        if(testVal > maxVal){
            event.srcElement.value =  event.srcElement.max;
        }
    }
    ub_row_change_points(pointsId);
    event.preventDefault();
}

/*
    UI Wrapper for rows
*/
function ub_row_add_elms(rowData, celCount, tagType, rowId, celName){
    rowData.cells[celCount].getElementsByTagName(tagType)[0].setAttribute('id', rowId + celName);
    if(celName === '_points'){
        rowData.cells[celCount].getElementsByTagName(tagType)[0].innerHTML = '0';
    }
    else if(celName !== '_name'){
        rowData.cells[celCount].getElementsByTagName(tagType)[0].value = 0;
        document.getElementById(rowId + celName).addEventListener("input", ub_row_on_change_event);
    }
    return celCount + 1;
}
function ub_row_add(){
    let table = document.getElementById('unitTable');
    let newRow = table.insertRow();
    let rowTemplate = window.nodeFileSys.loadHTML('layout/pages/unitBuilder_unitRow.html');
    newRow.innerHTML = rowTemplate;
    let newRowId = 'unitRow'+table.rows.length;
    newRow.setAttribute('id', newRowId);
    let cellCount = 0;

    cellCount = ub_row_add_elms(newRow, cellCount, 'input', newRowId, '_name');
    
    cellCount = ub_row_add_elms(newRow, cellCount, 'input', newRowId, '_size');
    
    cellCount = ub_row_add_elms(newRow, cellCount, 'input', newRowId, '_move');
    
    cellCount = ub_row_add_elms(newRow, cellCount, 'input', newRowId, '_evade');
    
    cellCount = ub_row_add_elms(newRow, cellCount, 'input', newRowId, '_DMGM');
    
    cellCount = ub_row_add_elms(newRow, cellCount, 'input', newRowId, '_DMGR');
    
    cellCount = ub_row_add_elms(newRow, cellCount, 'input', newRowId, '_range');
    
    cellCount = ub_row_add_elms(newRow, cellCount, 'input', newRowId, '_armor');
    
    cellCount = ub_row_add_elms(newRow, cellCount, 'input', newRowId, '_structure');
    
    cellCount = ub_row_add_elms(newRow, cellCount, 'label', newRowId, '_points');

}
