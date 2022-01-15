/*
    Javascript layer for page: UnitBuilder
*/
const btnAddUnit = document.getElementById('btnAddUnit');

let searchArray = [];
let tagWindow_tagArray = [];
let row_tagArray = [];
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
    util: convert tagArray to string
*/
function ub_tags_arrayToString(srcArray){
    let str = "";
    for(let item in srcArray){
        str = str + srcArray[item] + ' ';
    }
    return str;
}

function ub_tags_stringToArray(strVal){
    let outArray = [];
    let strArray = strVal.split(" ");
    strArray = strArray.filter(e =>  e);
    for(let str in strArray){
        outArray.push(parseInt(strArray[str]));
    }
    return outArray; 
}

/*
    check if #unitRow tag list has a given tag already.
*/
function ub_tags_checkExisting(tagId){
    if(tagWindow_tagArray.length === 0){
        return false;
    }
    for(let tagIdx in tagWindow_tagArray){
        if(tagIdx !== NaN && tagId === tagWindow_tagArray[tagIdx]){
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
        let tagId = parseInt(tagWindow_tagArray[parseInt(tagIdx)]);
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
function ub_tagModal_update_tagBuffer(newVal, addMe){
    if(addMe){
        tagWindow_tagArray.push(newVal);
    }
    else{
        let idx = tagWindow_tagArray.indexOf(newVal);
        if(idx > -1){
            tagWindow_tagArray.splice(idx, 1);
        }
    }
    return tagWindow_tagArray;
}

/*
    re-run all tag requirements on incoming row_tagArray value.

*/
function ub_tagModal_update_all_reqs(){
    let rowId = document.getElementById('tagWindow_rowId').value;
    let unitTotal = parseFloat(document.getElementById('tagWindow_baseCost').innerHTML);
    let tagTotalCost = parseFloat(document.getElementById('tagWindow_tagCost').innerHTML);

    let tagId = 0;
    let tagRuleList = document.getElementById('tagRulesListData').getElementsByTagName('tbody')[0];
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
            tagRow.children[2].children[0].innerHTML = "0";
            if(ub_tags_checkExisting(tagId)){
                tagTotalCost -= cost; 
                tagWindow_tagArray = ub_tagModal_update_tagBuffer(tagId, isCheck);
            }
        }
        
        tagRow = tagRow.nextSibling;
        tagId++;
    }
    document.getElementById('tagWindow_tagCost').innerHTML = tagTotalCost;
    document.getElementById('tagWindow_totalCost').innerHTML = unitTotal + tagTotalCost;
}

/*
    Running in the background whenever stats change.
*/
function ub_tagModal_tag_check_req(rowId){
    let unitTotal = parseFloat(document.getElementById(rowId + '_points').innerHTML);
    let tagTotalCost = parseFloat(document.getElementById(rowId + '_tagTotal').innerHTML);

    let tagCacheArray = [];
    if(tagWindow_tagArray.length !== 0){
        tagCacheArray = tagWindow_tagArray;
    }
    tagWindow_tagArray = ub_tags_stringToArray(document.getElementById(rowId + '_tagList').value);

    //
    let tagId = 0;
    for(let tag in tagInfo.data){

        tagId = tag;
        let tagObj = tagInfo.data[tagId];

        let isCheck = ub_tags_checkExisting(tagId);

        if(isCheck){

            let warn = tagInfo.data[tagId].reqs(rowId);
            if(warn){
                isCheck = false;
            }
            
            let cost = tagObj.func(rowId);
            cost = parseFloat(cost.toFixed(1));

            if(!isCheck){
                if(ub_tags_checkExisting(tagId, tempArray)){
                    tagTotalCost -= cost; 
                }
                tagWindow_tagArray = ub_tagModal_update_tagBuffer(tagId, isCheck);
            }
        }
    }
    document.getElementById(rowId + '_tagTotal').innerHTML = tagTotalCost;
    document.getElementById(rowId + '_tagList').innerHTML = ub_tags_arrayToString(tagWindow_tagArray);

    if(tagCacheArray.length !== 0){
        tagWindow_tagArray = tagCacheArray;
    }
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

    ub_tagModal_tag_check_req(rowId);

    return pointsVal;
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
    let tagEqt = document.getElementById('tagWindow_equation');
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
    let warn = tagInfo.data[tagId].reqs(document.getElementById('tagWindow_rowId').value);
    if(warn === ''){
        document.getElementById('tagWindow_descWarn').innerHTML = "";
        tagRow.classList.remove('tagRuleLineDisable');
        return false;
    }
    document.getElementById('tagWindow_descWarn').innerHTML = warn;
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
    let rowId = document.getElementById('tagWindow_rowId').value;
    let tagCost = parseFloat(document.getElementById('tagWindow_tagCost').innerHTML);
    let unitTotal = parseFloat(document.getElementById('tagWindow_baseCost').innerHTML);

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
        tagRow.children[2].children[0].innerHTML = "0";
        tagCost -= cost; 
    }

    tagWindow_tagArray = ub_tagModal_update_tagBuffer(tagId, isCheck);

    document.getElementById('tagWindow_tagCost').innerHTML = tagCost;
    document.getElementById('tagWindow_totalCost').innerHTML = unitTotal + tagCost;

    ub_tagModal_update_all_reqs();
}
/*
    tagModal/close-or-save
*/
function ub_tagModal_close(doSave){
    if(doSave){
        let unitRow = document.getElementById('tagWindow_rowId').value;
        let unitTagList = document.getElementById(unitRow + '_tagList');
        let unitTagCost = document.getElementById(unitRow + '_tagTotal');
        
        document.getElementById('tagWindow_tagBuffer').value = ub_tags_arrayToString(tagWindow_tagArray);
        unitTagList.value = document.getElementById('tagWindow_tagBuffer').value;
        unitTagCost.innerHTML = document.getElementById('tagWindow_tagCost').innerHTML;
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
    let rowId = ub_get_rowid(event.srcElement.id);
    let tagModal = document.getElementById('tagModal');
    let rowTags = document.getElementById(rowId+'_tagList').value;

    tagModal.removeAttribute('hidden');
    tagModal.innerHTML = window.nodeFileSys.loadHTML('layout/pages/unitBuilder/tagWindow.html');

    let tagWindow = document.getElementById('tagWindow');
    
    //zero-out the tag window array
    tagWindow_tagArray.length = 0;

    //set hidden input to parent rowId from the unit table
    document.getElementById('tagWindow_rowId').value = rowId;
    tagWindow.style.display = 'block';

    //set base total display in tagWindow
    document.getElementById('tagWindow_baseCost').innerHTML = document.getElementById(rowId+'_points').innerHTML;

    //copy unitRow_tags input value to tagWindow_tagBuffer
    if(rowTags.length !== 0){
        document.getElementById('tagWindow_tagBuffer').value = rowTags;
        tagWindow_tagArray = ub_tags_stringToArray(rowTags);
    }
    else{
        document.getElementById('tagWindow_tagBuffer').value = "";
    }

    //zero-out cost totals first.
    document.getElementById('tagWindow_tagCost').innerHTML = document.getElementById(rowId+'_tagTotal').innerHTML;
    document.getElementById('tagWindow_totalCost').innerHTML = "0";

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
        tagRuleRow.children[1].children[0].addEventListener('click', ()=>{ub_tagModal_tagRow_check(tagRuleRow);});

        //set tag id related to tagInfo[x]
        tagRuleRow.children[1].children[1].value = "" + tagId + "";

        let isCheck = ub_tags_checkExisting(tagId, tagWindow_tagArray);
 
        tagRuleRow.children[1].children[0].checked = isCheck;
        tagRuleRow.children[2].children[0].innerHTML = "0";
        tagId++;
    }
    //wonderful double loop - we can't write and validate the tag list in the same go...
    ub_tagModal_update_all_reqs();

    //clear out warn box
    document.getElementById('tagWindow_descWarn').innerHTML = '';

    document.getElementById('tagWindow_equation').innerHTML = '';

    //set on-clicks
    document.getElementById('tagWindowClose').addEventListener("click", (event) =>{
        ub_tagModal_close(false);
        event.preventDefault();
    });
    document.getElementById('tagWindowSave').addEventListener("click", (event) =>{
        ub_tagModal_close(true)
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

function ub_row_add_element_label_points(rowData, celCount, tagType, rowId, celName){
    rowData.cells[celCount].getElementsByTagName(tagType)[0].setAttribute('id', rowId + celName);
    rowData.cells[celCount].getElementsByTagName(tagType)[0].innerHTML = "0";
    return celCount + 1;
}

function ub_row_add_element_tag(rowData, celCount, tagType, rowId, celName){
    rowData.cells[celCount].getElementsByTagName(tagType)[0].setAttribute('id', rowId + celName);
    rowData.cells[celCount].children[1].setAttribute('id', rowId + '_tagList');
    document.getElementById(rowId + '_tags').addEventListener("click", ub_row_tags_onclick);
    document.getElementById(rowId + '_tagList').innerHTML = "";
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
    
    cellCount = ub_row_add_element_label_points(newRow, cellCount, 'label', newRowId, '_points');

    cellCount = ub_row_add_element_tag(newRow, cellCount, 'button', newRowId, '_tags');

    cellCount = ub_row_add_element_label_points(newRow, cellCount, 'label', newRowId, '_tagTotal');
}
