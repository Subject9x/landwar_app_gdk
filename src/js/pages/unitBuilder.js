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
    let evadeCost = uc_calc_Evade(sizeVal, evadeVal, moveVal);
    let dmgMeleeCost = uc_calc_Damage_Melee(dmgMeleeVal, moveVal);
    let dmgRangeCost = uc_calc_Damage_Range(dmgRangeVal);
    let rangeCost = uc_calc_Range(moveVal, rangeVal, dmgRangeVal);
    let armorCost = uc_calc_Armor(armorVal, sizeVal);
    let structCost = uc_calc_Structure(structVal,sizeVal);
    
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
    pointsVal = Math.max(0, pointsVal);
    pointsVal = Math.round(pointsVal);

    document.getElementById(rowId+'_points').innerHTML = pointsVal;
}

/*
    row id without '_x'
*/
function ub_get_rowid(rowTagVal){
    let rowId = rowTagVal.substring(0,rowTagVal.indexOf('_'));
    return rowId;
}

/*
    TD <input> onChange binding.
*/
function ub_row_on_change_event(event){
    let pointsId = ub_get_rowid(event.srcElement.id);
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
    tagModal window funcs
*/
function ub_tagModal_tagRow_click(tagRow){
    let tagText = document.getElementById('tagWindow_descText');
    let tagId = parseInt(tagRow.children[1].children[1].value);
    tagText.innerHTML = '';

    tagText.innerHTML = tagInfo.data[tagId].desc;
}

function ub_tagModal_tagRow_check(tagRow){
    
}
/*
    On-click - instantiate the tagModalWindow,
        populate with tagInfo data, the source rowId, 
*/
function ub_row_tags_onclick(event){
    let rowId = event.srcElement.id;

    let tagModal = document.getElementById('tagModal');

    tagModal.removeAttribute('hidden');
    tagModal.innerHTML = window.nodeFileSys.loadHTML('layout/pages/unitBuilder/tagWindow.html');

    let tagWindow = document.getElementById('tagWindow');
    
    //set hidden input to parent rowId from the unit table
    document.getElementById('tagWindow_RowId').value = ub_get_rowid(rowId);
    tagWindow.style.display = 'block';

    //build the complete TAG list in the tag table.
    let tagId = 0;
    let tagRuleList = document.getElementById('tagRulesListData').getElementsByTagName('tbody')[0];
    for(let tag in tagInfo.data){
        let tagRuleRow = tagRuleList.insertRow();

        tagRuleRow.innerHTML = window.nodeFileSys.loadHTML('layout/pages/unitBuilder/tagRulesRow.html');
        //set title and rollover for tag label.
        tagRuleRow.children[0].innerHTML = tagInfo.data[tag].title;
        tagRuleRow.children[0].classList.add('tagRuleLineHover');
        tagRuleRow.children[0].addEventListener('click', ()=>{ub_tagModal_tagRow_click(tagRuleRow);});
        //set tag id related to tagInfo[x]
        tagRuleRow.children[1].children[1].value = tagId;

        

        tagId++;
    }
    document.getElementById('tagWindowClose').addEventListener("click", (event) =>{
        tagWindow.style.display = 'none';
        tagModal.setAttribute('hidden','true');
        tagModal.innerHTML = "";
        event.preventDefault();
    });
    event.preventDefault();
}

/*
    TD <label> onChange binding for points total.
*/


/*
    Get Row's values
*/ 

/*
    UI Wrapper for rows
*/
function ub_row_add_element_input_num(rowData, celCount, tagType, rowId, celName){
    rowData.cells[celCount].getElementsByTagName(tagType)[0].setAttribute('id', rowId + celName);
    rowData.cells[celCount].getElementsByTagName(tagType)[0].value = 0;
    document.getElementById(rowId + celName).addEventListener("input", ub_row_on_change_event);
    return celCount + 1;
}

function ub_row_add_element_input_name(rowData, celCount, tagType, rowId, celName){
    rowData.cells[celCount].getElementsByTagName(tagType)[0].setAttribute('id', rowId + celName);
    return celCount + 1;
}

function ub_row_add_element_input_points(rowData, celCount, tagType, rowId, celName){
    rowData.cells[celCount].getElementsByTagName(tagType)[0].setAttribute('id', rowId + celName);
    rowData.cells[celCount].getElementsByTagName(tagType)[0].value = "0";
    return celCount + 1;
}

function ub_row_add_element_tag(rowData, celCount, tagType, rowId, celName){
    rowData.cells[celCount].getElementsByTagName(tagType)[0].setAttribute('id', rowId + celName);
    rowData.cells[celCount].children[1].setAttribute('id', rowId + '_tags');
    document.getElementById(rowId + '_tags').addEventListener("click", ub_row_tags_onclick);
    return celCount + 1;
}

function ub_row_add(){
    let table = document.getElementById('unitTable');
    let newRow = table.insertRow();
    let rowTemplate = window.nodeFileSys.loadHTML('layout/pages/unitBuilder/unitRow.html');
    newRow.innerHTML = rowTemplate;
    let newRowId = 'unitRow'+table.rows.length;
    newRow.setAttribute('id', newRowId);
    let cellCount = 0;

    cellCount = ub_row_add_element_input_name(newRow, cellCount, 'input', newRowId, '_name');
    
    cellCount = ub_row_add_element_input_num(newRow, cellCount, 'input', newRowId, '_size');
    
    cellCount = ub_row_add_element_input_num(newRow, cellCount, 'input', newRowId, '_move');
    
    cellCount = ub_row_add_element_input_num(newRow, cellCount, 'input', newRowId, '_evade');
    
    cellCount = ub_row_add_element_input_num(newRow, cellCount, 'input', newRowId, '_DMGM');
    
    cellCount = ub_row_add_element_input_num(newRow, cellCount, 'input', newRowId, '_DMGR');
    
    cellCount = ub_row_add_element_input_num(newRow, cellCount, 'input', newRowId, '_range');
    
    cellCount = ub_row_add_element_input_num(newRow, cellCount, 'input', newRowId, '_armor');
    
    cellCount = ub_row_add_element_input_num(newRow, cellCount, 'input', newRowId, '_structure');
    
    cellCount = ub_row_add_element_input_points(newRow, cellCount, 'label', newRowId, '_points');

    cellCount = ub_row_add_element_tag(newRow, cellCount, 'button', newRowId, '_tags');

    cellCount = ub_row_add_element_input_points(newRow, cellCount, 'label', newRowId, '_tags');
}
