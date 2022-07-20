/*
    Javascript layer for page: UnitBuilder
*/
const btnAddUnit = $("#btnAddUnit")[0];
let unitTableRowCount = 0;
let searchArray = [];
let tagWindow_tagArray = [];
let row_tagArrays = {};

function ub_sheet_close_window(event){
    window.api.send('ub-close-sheet', dialogLoadOptionsUnitList);
    event.preventDefault();
}

function ub_row_tag_ini(rowId){
    let rowData = [];
    row_tagArrays[rowId] = rowData;
    return rowData;
}

function ub_row_tag_insert(rowId, newTag){
    let rowTags = row_tagArrays[rowId];
    rowTags.push(newTag);
}

/*
    util: convert tagArray to string
*/
function ub_tags_update_row_array(rowId, srcArray){
    let rowArray = row_tagArrays[rowId];
    ub_util_array_deepcpy(srcArray, rowArray)
}

function ub_util_array_deepcpy(srcArray, dstArray){
    dstArray.length = 0;
    for(let idx in srcArray){
        dstArray.push(srcArray[idx]);
    }
}


/*
    unitBuilder -> Control Row buttons
*/
function ub_control_select_all(selectAll){
    let rowTableBody = $("#unitTable>tbody")[0];
    if(rowTableBody.rows.length <= 1){
        return;
    }
    $("#unitTable>tbody>tr").each((index, tr)=>{
        if(index != 0){
            let elm = $("#"+tr.id + "_select")[0];
            elm.checked = selectAll;
        }
    });
};


function ub_control_delete_select(){
    let rowTableBody = $("#unitTable>tbody")[0];
    if(rowTableBody.rows.length <= 1){
        return;
    }
    
    $("#unitTable>tbody>tr").each((index, tr)=>{
        if(index != 0){
            let elm = $("#"+tr.id + "_select")[0];
            if(elm.checked === true){
                $("#"+tr.id)[0].remove();
            }
        }
    });
}

function ub_control_save_select(event){
    let tableData = $("#unitTable>tbody")[0];
    let cnt = 0;

    if(tableData.rows <= 1){
        event.preventDefault();
        return;
    }

    
    $("#unitTable>tbody>tr").each((index, tr)=>{
        if(index != 0){
            let elm = $("#"+tr.id + "_select")[0];
            if(elm.checked == true){
                cnt++;
            }
        }
    });

    if(cnt >0){
        file_unitBuild_export_csv(tableData);
    }
    event.preventDefault();
}

function ub_control_loadfile(event){
    let dialog = dialogLoadOptionsUnitList;
    window.api.send('ub-dialog-load-async', dialogLoadOptionsUnitList);
    console.log(window);    //debug
    console.log(window.api);
    event.preventDefault();
}
/*
    Row Data manipulation
*/
/*
    row id without '_x'
*/
function ub_get_rowid(rowTagVal){
    let rowId = rowTagVal.substring(0,rowTagVal.indexOf('_'));
    return rowId;
}

/*
    check if #unitRow tag list has a given tag already.
*/
function ub_tags_checkExisting(tagId, srcArray){
    let tagVal = parseInt(tagId);
    if(srcArray.length === 0){
        return false;
    }
    for(let tagIdx in srcArray){
        if(tagVal !== NaN && tagVal === srcArray[tagIdx]){
            return true;
        }
    }
    return false;
}

function ub_tags_checkByName(tagName){
    if(tagWindow_tagArray.length === 0){
        return false;
    }
    for(let tagIdx in tagWindow_tagArray){
        let tagId = tagWindow_tagArray[parseInt(tagIdx)];
        if(!Number.isNaN(tagId)){
            if(tagInfo.data[tagId].title === tagName){
                return true;
            }
        }
    }
    return false;
}


/*
    update the _tagBuffer value.
*/
function ub_tagModal_update_tagArray(newVal, addMe){
    let intNewVal = parseInt(newVal);
    
    if(addMe){
        if(!ub_tags_checkExisting(newVal, tagWindow_tagArray)){
            tagWindow_tagArray.push(intNewVal);
        }
    }
    else{
        if(ub_tags_checkExisting(newVal, tagWindow_tagArray)){
            let idx = tagWindow_tagArray.indexOf(intNewVal);
            if(idx > -1){
                tagWindow_tagArray.splice(idx, 1);
            }
        }
    }
    return tagWindow_tagArray;
}

/*
    re-run all tag requirements on incoming row_tagArray value.

*/
function ub_tagModal_validate_tags(){
    let rowId = $("#tagWindow_rowId")[0].value;
    let unitTotal = parseFloat($("#tagWindow_baseCost")[0].innerHTML);
    let tagTotalCost = parseFloat($("#tagWindow_tagCost")[0].innerHTML);

    let tagRuleList = $("#tagRulesListData>tbody")[0];
    let tagRow = tagRuleList.childNodes[1];
    for(let tag in tagInfo.data){

        let tagId = tagRow.children[1].children[1].value;
        let tagObj = tagInfo.data[tagId];
        let isCheck = tagRow.children[1].children[0].checked;

        let cost = tagObj.func(rowId);
        cost = parseFloat(cost.toFixed(1));

        let warn = ub_tagModal_tagRow_reqs(tagRow);
        if(warn){
            isCheck = false;
            tagRow.children[1].children[0].checked = false;
            tagRow.children[1].children[0].setAttribute('disabled', 'true');
        }
        else{
            tagRow.children[1].children[0].removeAttribute('disabled');
        }
        
        if(warn && !isCheck){
            tagRow.classList.remove('tagRuleLineActive');
            tagRow.children[2].children[0].innerHTML = "";
            if(ub_tags_checkExisting(tagId, tagWindow_tagArray)){
                tagTotalCost -= cost; 
                tagWindow_tagArray = ub_tagModal_update_tagArray(tagId, isCheck);
            }
        }
        
        tagRow = tagRow.nextSibling;
    }

    $("#tagWindow_tagCost")[0].innerHTML = tagTotalCost;
    $("#tagWindow_totalCost")[0].innerHTML = unitTotal + tagTotalCost;
}

/*
    Running in the background whenever stats change.
*/
function ub_tagModal_tag_check_req(rowId){
    let unitTotal = parseFloat($("#"+ rowId + '_points')[0].innerHTML);
    let tagTotalCost = parseFloat($("#"+ rowId + '_tagTotal')[0].innerHTML);

    let tagCacheArray = row_tagArrays[rowId];
    //
    let tagId = 0;
    for(let tag in tagInfo.data){

        tagId = tag;
        let tagObj = tagInfo.data[tagId];

        let isCheck = ub_tags_checkExisting(tagId, tagCacheArray);

        if(isCheck){

            let warn = tagInfo.data[tagId].reqs(rowId);
            if(warn){
                isCheck = false;
            }
            
            let cost = tagObj.func(rowId);
            cost = parseFloat(cost.toFixed(1));

            if(!isCheck){
                if(ub_tags_checkExisting(tagId, tagCacheArray)){
                    tagTotalCost -= cost; 
                }
                tagCacheArray = ub_tagModal_update_tagArray(tagId, isCheck);
            }
        }
    }
    $("#"+rowId + '_tagTotal')[0].innerHTML = tagTotalCost;
}


/*
    tagModal window funcs
*/
function ub_tagModal_tagRow_clickInfo(tagRow){
    let tagText = $('#tagWindow_descText')[0];
    let tagTitle = $('#tagWindow_descTitle')[0];
    let tagEqt = $('#tagWindow_equation')[0];
    let tagId = parseInt(tagRow.children[1].children[1].value);

    tagText.innerHTML = '';
    tagText.innerHTML = tagInfo.data[tagId].desc;

    tagTitle.innerHTML = '';
    tagTitle.innerHTML = '<h3>' + tagInfo.data[tagId].title + '</h3>';

    tagEqt.innerHTML = '';

    if( tagInfo.data[tagId].reqs !== undefined){
        let warn = ub_tagModal_tagRow_reqs(tagRow);
        if(warn){
            tagRow.children[1].children[0].checked = false;
            tagRow.children[1].children[0].setAttribute('disabled', 'true');
        }
        else{
            tagRow.children[1].children[0].removeAttribute('disabled');
        }
    }

    if(tagInfo.data[tagId].eqt !== undefined){
        tagEqt.innerHTML = tagInfo.data[tagId].eqt;
    }
}

/*
    tagModal/rulesValidate
        runs the reqs() function of the tag and returns true/false
*/
function ub_tagModal_tagRow_reqs(tagRow){
    let tagId = parseInt(tagRow.children[1].children[1].value);
    let warn = tagInfo.data[tagId].reqs($('#tagWindow_rowId')[0].value);
    if(warn === ''){
        $('#tagWindow_descWarn')[0].innerHTML = "";
        tagRow.classList.remove('tagRuleLineDisable');
        return false;
    }
    $('#tagWindow_descWarn')[0].innerHTML = warn;
    tagRow.classList.remove('tagRuleLineActive');
    tagRow.classList.add('tagRuleLineDisable');
    return true;
}
/*
    tagModal/tagWindow/tagRow/Checkbox
*/
function ub_tagModal_tagRow_check(tagRow){
    let isCheck = tagRow.children[1].children[0].checked;
    let tagId = tagRow.children[1].children[1].value;
    let tagObj = tagInfo.data[tagId];
    let rowId = $('#tagWindow_rowId')[0].value;
    let tagCost = parseFloat($('#tagWindow_tagCost')[0].innerHTML);
    let unitTotal = parseFloat($('#tagWindow_baseCost')[0].innerHTML);

    let cost = tagObj.func(rowId);
    cost = parseFloat(cost.toFixed(1));

    if(isCheck){
        //adding tag to list, already has passed validation
        tagRow.classList.add('tagRuleLineActive');
        tagRow.children[2].children[0].innerHTML = cost;
        tagCost += cost;
    }
    else{
        //removing existing tag from list.
        //was on list, but now gone.
        tagRow.classList.remove('tagRuleLineActive');
        tagRow.children[2].children[0].innerHTML = "";
        tagCost -= cost; 
    }

    tagWindow_tagArray = ub_tagModal_update_tagArray(tagId, isCheck);

    $('#tagWindow_tagCost')[0].innerHTML = tagCost;
    $('#tagWindow_totalCost')[0].innerHTML = unitTotal + tagCost;

    ub_tagModal_validate_tags();
}
/*
    tagModal/close-or-save
*/
function ub_tagModal_close(doSave){
    if(doSave){
        let unitRowId = $('#tagWindow_rowId')[0].value;
        // let unitTagList = document.getElementById(unitRowId + '_tagList');
        let unitTagCost = $("#" + unitRowId + '_tagTotal')[0];

        unitTagCost.innerHTML = $('#tagWindow_tagCost')[0].innerHTML;

        ub_tags_update_row_array(unitRowId, tagWindow_tagArray);
        $("#" + unitRowId + "_total")[0].innerHTML = parseFloat($("#" + unitRowId + '_points')[0].innerHTML) + parseFloat(unitTagCost.innerHTML);
    }


    tagWindow.style.display = 'none';
    tagModal.setAttribute('hidden','true');
    tagModal.innerHTML = "";
}


/*
    On-click - instantiate the tagModalWindow,
        populate with tagInfo data, the source rowId, 
*/
function ub_row_tags_onclick(event){
    
    let rowId = ub_get_rowid(this.id);

    let tagModal = $('#tagModal')[0];
    tagModal.innerHTML = '';
    tagModal.removeAttribute('hidden');
    tagModal.innerHTML = window.nodeFileSys.loadHTML('layout/pages/unitBuilder/tagWindow.html');

    let tagWindow = $('#tagWindow')[0];

    //set hidden input to parent rowId from the unit table
    $('#tagWindow_rowId')[0].value = rowId;
    tagWindow.style.display = 'block';

    //set base total display in tagWindow
    $('#tagWindow_baseCost')[0].innerHTML = $("#"+ rowId + '_points')[0].innerHTML;

    //zero-out the tag window array
    tagWindow_tagArray.length = 0;

    tagWindow_tagArray.length = 0;
    ub_util_array_deepcpy(row_tagArrays[rowId], tagWindow_tagArray);

    //build the complete TAG list in the tag table.
    let tagRuleList = $("#tagRulesListData>tbody")[0];
    let tagCost = 0;
    for(let tag in tagInfo.data){
        let tagRuleRow = tagRuleList.insertRow();

        tagRuleRow.innerHTML = window.nodeFileSys.loadHTML('layout/pages/unitBuilder/tagRulesRow.html');
        //set title and rollover for tag label.
        tagRuleRow.children[0].innerHTML = tagInfo.data[tag].title;
        tagRuleRow.children[0].classList.add('tagRuleLineHover');
        tagRuleRow.children[0].addEventListener('click', ()=>{ub_tagModal_tagRow_clickInfo(tagRuleRow);});

        //set tag checkbox callback
        tagRuleRow.children[1].children[0].addEventListener('click', ()=>{ub_tagModal_tagRow_check(tagRuleRow);});

        //set tag id related to tagInfo[x]
        tagRuleRow.children[1].children[1].value = "" + tag + "";

        let isCheck = ub_tags_checkExisting(tag, tagWindow_tagArray);
        
        if(isCheck){
            let cost = tagInfo.data[tag].func(rowId);
            cost = parseFloat(cost.toFixed(1));

            tagRuleRow.classList.add('tagRuleLineActive');
            tagRuleRow.children[2].children[0].innerHTML = cost;
            tagCost += cost;
            tagRuleRow.children[1].children[0].checked = true;
        }
        else{
            tagRuleRow.children[2].children[0].innerHTML = "";
            tagRuleRow.children[1].children[0].checked = false;
        }
    }

    //wonderful double loop - we can't write and validate the tag list in the same go...
    ub_tagModal_validate_tags();

    //zero-out cost totals first.
    $('#tagWindow_tagCost')[0].innerHTML = tagCost;
    $('#tagWindow_totalCost')[0].innerHTML = parseInt($('#tagWindow_baseCost')[0].innerHTML) + tagCost;

    //clear out warn box
    $('#tagWindow_descWarn')[0].innerHTML = '';
    $('#tagWindow_equation')[0].innerHTML = '';

    //set on-clicks
    $('#tagWindowClose')[0].addEventListener("click", (event) =>{
        ub_tagModal_close(false);
        event.preventDefault();
    });
    $('#tagWindowSave')[0].addEventListener("click", (event) =>{
        ub_tagModal_close(true);
        event.preventDefault();
    });

    event.preventDefault();
}

/*
    UNIT ROW FUNCTIONS
*/
function ub_row_select_check(rowData, celCount, rowId, celName){
    let rowSelectCheck = rowData.cells[celCount].getElementsByTagName('input')[0];
    rowSelectCheck.setAttribute('id', rowId + celName);

    return celCount + 1;
}
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

function ub_row_add_element_label_points(rowData, celCount, tagType, rowId, celName){
    rowData.cells[celCount].getElementsByTagName(tagType)[0].setAttribute('id', rowId + celName);
    rowData.cells[celCount].getElementsByTagName(tagType)[0].innerHTML = "0";
    return celCount + 1;
}

function ub_row_add_element_tag(rowData, celCount, tagType, rowId, celName){
    rowData.cells[celCount].getElementsByTagName(tagType)[0].setAttribute('id', rowId + celName);

    $('#' + rowId + '_tags')[0].addEventListener("click", ub_row_tags_onclick);
    return celCount + 1;
}

function ub_row_add(){
    let table = $("#unitTable")[0];
    let newRow = table.insertRow();
    let rowTemplate = window.nodeFileSys.loadHTML('layout/pages/unitBuilder/unitRow.html');
    newRow.innerHTML = rowTemplate;
    
    unitTableRowCount += 1; //global counter to ensure each row is a true UID.
    let newRowId = 'unitRow' + unitTableRowCount;
    newRow.setAttribute('id', newRowId);
    
    let cellCount = 0;

    cellCount = ub_row_select_check(newRow, cellCount, newRowId, '_select');

    cellCount = ub_row_add_element_input_name(newRow, cellCount, 'input', newRowId, '_name');
    
    cellCount = ub_row_add_element_input_num(newRow, cellCount, 'input', newRowId, '_size');
    
    cellCount = ub_row_add_element_input_num(newRow, cellCount, 'input', newRowId, '_move');
    
    cellCount = ub_row_add_element_input_num(newRow, cellCount, 'input', newRowId, '_evade');
    
    cellCount = ub_row_add_element_input_num(newRow, cellCount, 'input', newRowId, '_DMGM');
    
    cellCount = ub_row_add_element_input_num(newRow, cellCount, 'input', newRowId, '_DMGR');
    
    cellCount = ub_row_add_element_input_num(newRow, cellCount, 'input', newRowId, '_range');
    
    cellCount = ub_row_add_element_input_num(newRow, cellCount, 'input', newRowId, '_armor');
    
    cellCount = ub_row_add_element_input_num(newRow, cellCount, 'input', newRowId, '_structure');
    
    cellCount = ub_row_add_element_label_points(newRow, cellCount, 'label', newRowId, '_points');

    cellCount = ub_row_add_element_tag(newRow, cellCount, 'button', newRowId, '_tags');

    cellCount = ub_row_add_element_label_points(newRow, cellCount, 'label', newRowId, '_tagTotal');

    cellCount = ub_row_add_element_label_points(newRow, cellCount, 'label', newRowId, '_total');

    ub_row_tag_ini(newRowId);

    return newRowId;
}

function ub_row_remove(){
    let table = $('#unitTable')[0];
    if(table.rows.length < 2){
        return;
    }
    $('#unitRow'+ (table.rows.length - 1))[0].remove();
}

/*
    Binder functions for unitBuilder
*/

function ub_row_change_points(rowId){

    let sizeVal = parseInt($("#"+ rowId + '_size')[0].value);
    let moveVal = parseInt($("#"+ rowId + '_move')[0].value);
    let evadeVal = parseInt($("#"+ rowId + '_evade')[0].value);
    let dmgMeleeVal = parseInt($("#"+ rowId + '_DMGM')[0].value);
    let dmgRangeVal = parseInt($("#"+ rowId + '_DMGR')[0].value);
    let rangeVal = parseInt($("#"+ rowId + '_range')[0].value);
    let armorVal = parseInt($("#"+ rowId + '_armor')[0].value);
    let structVal = parseInt($("#"+ rowId + '_structure')[0].value);

    let sizeCost = uc_calc_Size(sizeVal);
    let moveCost = uc_calc_Move(moveVal, sizeVal);
    let evadeCost = uc_calc_Evade(sizeVal, evadeVal, moveVal);
    let dmgMeleeCost = uc_calc_Damage_Melee(dmgMeleeVal, moveVal);
    let dmgRangeCost = uc_calc_Damage_Range(dmgRangeVal);
    let rangeCost = uc_calc_Range(moveVal, rangeVal, dmgRangeVal);
    let armorCost = uc_calc_Armor(armorVal, sizeVal);
    let structCost = uc_calc_Structure(structVal,sizeVal);
    

    //DEBUG ONLY
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

    $("#" + rowId+'_points')[0].innerHTML = pointsVal;

    
    return pointsVal;
}

/*
    Validates Row-tag list and removes invalid tags
*/
function ub_row_tag_validate(rowId){
    let rowArray = row_tagArrays[rowId];
    if(rowArray.length === 0){
        return;
    }

    let newTagcost = 0;
    let undoCost = 0;
    let tagTotal = 0;

    let removeThese = [];
    for(let idx in rowArray){
        let tagId = rowArray[idx];
        let tagData = tagInfo.data[tagId];
        let tagCost = tagData.func(rowId);
        if(tagData.reqs(rowId) !== ''){
            undoCost += (tagCost * -1);
            removeThese.push(idx);
        }
        else{
            newTagcost += tagCost;
        }
    }
    tagTotal = newTagcost + undoCost;
    tagTotal = tagTotal.toFixed(1);

    $("#" + rowId + '_tagTotal')[0].innerHTML = tagTotal;

    for(let idx in removeThese){
        let index = removeThese[idx];
        rowArray = rowArray.splice(index, 1);
    }
}
/*
    TD <input> onChange binding.
*/
function ub_row_on_change_event(event){
    let thisRowId = ub_get_rowid(event.srcElement.id);
    if(event.srcElement.max){
        let maxVal = parseInt(event.srcElement.max);
        let testVal = parseInt(event.srcElement.value);
        if(testVal > maxVal){
            event.srcElement.value =  event.srcElement.max;
        }
    }
    ub_row_change_points(thisRowId);
    ub_row_tag_validate(thisRowId); //split from change_points becuase some req / cost funcs run change_points;
    $("#" + thisRowId + "_total")[0].innerHTML = parseFloat($("#" + thisRowId + '_points')[0].innerHTML) + parseFloat($("#" + thisRowId + '_tagTotal')[0].innerHTML);
    event.preventDefault();
}