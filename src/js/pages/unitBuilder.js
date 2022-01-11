/*
    Javascript layer for page: UnitBuilder
*/
const btnAddUnit = document.getElementById('btnAddUnit');


/*
    Row Data manipulation
*/

/*
        check if #unitRow tag list has a given tag already.
*/
function ub_tags_checkExisting(tagArray, tagId){
    
    if(tagArray === undefined ||tagArray.length === 0){
        return false;
    }
    let rowTagArray = tagArray.split(',');
    for(let tag in rowTagArray){
        if(parseInt(rowTagArray[tag]) === tagId){
            return true;
        }
    }
    return false;
}

/*
    update the _tagBuffer value.
*/
function ub_tagModal_update_tagBuffer(newVal){
    let tagBuffer = document.getElementById('tagWindow_tagBuffer').value;
    if(ub_tags_checkExisting(tagBuffer, newVal)){
        return;
    }
    if(tagBuffer.length === 0){
        tagBuffer = newVal;
    }
    else{
        tagBuffer = tagBuffer + ',' + newVal;
    }
    document.getElementById('tagWindow_tagBuffer').value = tagBuffer;
}

/*
    row id without '_x'
*/
function ub_get_rowid(rowTagVal){
    let rowId = rowTagVal.substring(0,rowTagVal.indexOf('_'));
    return rowId;
}


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
    let tagTitle = document.getElementById('tagWindow_descTitle');
    let tagId = parseInt(tagRow.children[1].children[1].value);

    tagText.innerHTML = '';
    tagText.innerHTML = tagInfo.data[tagId].desc;

    tagTitle.innerHTML = '';
    tagTitle.innerHTML = '<h3>' + tagInfo.data[tagId].title + '</h3>';
}

/*
    tagModal/tagWindow/tagRow/Checkbox
*/
function ub_tagModal_tagRow_check(tagRow){
    let isCheck = tagRow.children[1].children[0].checked;
    let tagId = tagRow.children[1].children[1].value;
    let tagObj = tagInfo.data[tagId];

    if(isCheck){
        tagRow.classList.add('tagRuleLineActive');
        ub_tagModal_update_tagBuffer(tagRow.children[1].children[1].value);
    }
    else{
        tagRow.classList.remove('tagRuleLineActive');
        tagRow.children[2].children[0].innerHTML = 0;
    }
}
/*
    tagModal/close
*/
function ub_tagModal_close(){

}
/*
    tagModal/Save
*/
function ub_tagModal_save(){
    let unitRow = document.getElementById('tagWindow_rowId').value;
    let unitTagList = document.getElementById(unitRow + '_tagList');
    unitTagList.value = document.getElementById('tagWindow_tagBuffer').value;
}
/*
    On-click - instantiate the tagModalWindow,
        populate with tagInfo data, the source rowId, 
*/
function ub_row_tags_onclick(event){
    let rowId = ub_get_rowid(event.srcElement.id);
    let tagModal = document.getElementById('tagModal');
    let rowTags = document.getElementById(rowId+'_tagList').value;

    tagModal.removeAttribute('hidden');
    tagModal.innerHTML = window.nodeFileSys.loadHTML('layout/pages/unitBuilder/tagWindow.html');

    let tagWindow = document.getElementById('tagWindow');
    
    //set hidden input to parent rowId from the unit table
    document.getElementById('tagWindow_rowId').value = rowId;
    tagWindow.style.display = 'block';

    //set base total display in tagWindow
    document.getElementById('tagWindow_baseCost').innerHTML = document.getElementById(rowId+'_points').innerHTML;

    //copy unitRow_tags input value to tagWindow_tagBuffer
    document.getElementById('tagWindow_tagBuffer').value = document.getElementById(rowId+'_tagList').innerHTML;

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

        //set tag checkbox callback
        tagRuleRow.children[1].children[0].addEventListener('change', ()=>{ub_tagModal_tagRow_check(tagRuleRow);});

        //set tag id related to tagInfo[x]
        tagRuleRow.children[1].children[1].value = tagId;
        if(ub_tags_checkExisting(rowTags, tagId)){
            tagRuleRow.classList.add('tagRuleLineActive');
            tagRuleRow.children[1].children[0].checked = true;
        }
        tagId++;
    }
    document.getElementById('tagWindowClose').addEventListener("click", (event) =>{
        tagWindow.style.display = 'none';
        tagModal.setAttribute('hidden','true');
        tagModal.innerHTML = "";
        event.preventDefault();
    });
    document.getElementById('tagWindowSave').addEventListener("click", (event) =>{
        ub_tagModal_save();
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
    rowData.cells[celCount].children[1].setAttribute('id', rowId + '_tagList');
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
