/*
    Javascript layer for page: UnitInfoCard Generator window
*/

let unitTableRowCount = 0;

let row_tagArrays = {};
let sheetData;
let unitRowTemplate =  window.nodeFileSys.loadHTML('layout/pages/unitCardGen/unitInfoCardraw.html');

function uic_window_setData(unitCardData){
    sheetData = unitCardData;
   // unitRowTemplate = window.nodeFileSys.loadHTML('layout/pages/unitCardGen/unitInfoCardraw.html');
}

function uic_window_close(event){
    event.preventDefault();
    window.api.send('close-window');
}

/*
    UNIT ROW FUNCTIONS
*/
function uic_row_add(){
    let table = document.querySelector("#unitTable");
    let newRow = table.insertRow();

    let rowTemplate = window.nodeFileSys.loadHTML('layout/pages/unitCardGen/unitRow.html');
    newRow.innerHTML = rowTemplate;

    unitTableRowCount += 1;
    newRow.setAttribute('id', 'unitRow' + unitTableRowCount);

    return newRow.id;
}

function uic_card_row_add(objData, newRowId){
    let cardTable = document.querySelector("#cardTable");
    
    let cardDiv = document.createElement('div');

    cardDiv.style = "float: left;";
    cardDiv.setAttribute('id', 'unit'+ unitTableRowCount); //already incremented to right value by preceding uic_row_add() call.
    cardDiv.innerHTML = unitRowTemplate;

    cardDiv.querySelector("#ucName").innerHTML = objData.unitName;
    cardDiv.querySelector("#ucSize").innerHTML = objData.size;
    cardDiv.querySelector("#ucMove").innerHTML = objData.move;
    cardDiv.querySelector("#ucEvade").innerHTML = objData.evade;
    cardDiv.querySelector("#ucMel").innerHTML = objData.dmgMelee;
    cardDiv.querySelector("#ucRange").innerHTML = objData.dmgRange;
    cardDiv.querySelector("#ucDist").innerHTML = objData.range + '"';
    cardDiv.querySelector("#ucArmor").innerHTML = objData.armor;
    cardDiv.querySelector("#ucPoints").innerHTML = '<b>' + objData.completeTotal + '</b>';

    let tagArr = row_tagArrays[newRowId];
    let tagList = cardDiv.querySelector("#ucKeywords");
    let tagItem;
    if(tagArr.length > 0){
        for(let tagNum in tagArr){
            let tagObj = sortedTags.find(isTag, [tagArr[tagNum]]);
            if(tagObj !== null && tagObj !== undefined && Object.keys(tagObj).length > 0 && !tagObj["disabled"]){
                tagItem = document.createElement('li');
                tagItem.innerHTML = tagObj.title;
                tagList.appendChild(tagItem);
            }
        }
    }

    cardTable.appendChild(cardDiv);
}


function uic_save_pdf(){
    let tableData = $("#cardTable")[0];
    $('#buttonRow')[0].setAttribute('hidden', true);

    file_unitCard_export_pdf(tableData.innerHTML);
}