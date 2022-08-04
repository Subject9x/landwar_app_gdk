/*
    Javascript layer for page: UnitInfoCard Generator window
*/

let unitTableRowCount = 0;

let row_tagArrays = {};


//Pixel offsets for each element on a card, where org = root + ofs
let nameOfs = [23, 19];
let ptsOfs = [936, 32];
let sizeOfs = [52, 151];
let moveOfs = [248, 151];
let evadeOfs = [434, 151];
let armorOfs = [631, 151];
let strucOfs = [828, 151];
let meleeOfs = [28, 289];
let rangeOfs = [237, 289];
let distOfs = [384, 289];
let tagsOfs = [28, 423];

function uic_window_close(){
    window.api.send('close-window');
}


/*
    UNIT ROW FUNCTIONS
*/
function uic_row_add(){
    let table = $("#unitTable")[0];
    let newRow = table.insertRow();

    let rowTemplate = window.nodeFileSys.loadHTML('layout/pages/unitCardGen/unitRow.html');
    newRow.innerHTML = rowTemplate;

    unitTableRowCount += 1;
    newRow.setAttribute('id', 'unitRow' + unitTableRowCount);

    return newRow.id;
}

function uic_card_row_add(objData, newRowId){
    let cardTable = $('#cardTable')[0];

    let cardDiv = document.createElement('div');
    //cardDiv.classList.add("grd-row-col-2-6");
    cardDiv.setAttribute('id', 'unit'+ unitTableRowCount); //already incremented to right value by preceding uic_row_add() call.
    cardDiv.innerHTML = window.nodeFileSys.loadHTML('layout/pages/unitCardGen/unitInfoCardraw.html');

    cardDiv.querySelector("#ucName").innerHTML = objData.unitName;

    cardDiv.querySelector("#ucSize").innerHTML = objData.size;
    
    cardDiv.querySelector("#ucMove").innerHTML = objData.move;
    
    cardDiv.querySelector("#ucEvade").innerHTML = objData.evade;
    
    cardDiv.querySelector("#ucMel").innerHTML = objData.dmgMelee;
    
    cardDiv.querySelector("#ucRange").innerHTML = objData.dmgRange;
    
    cardDiv.querySelector("#ucDist").innerHTML = objData.range;
    
    cardDiv.querySelector("#ucArmor").innerHTML = objData.armor;
    
    cardDiv.querySelector("#ucStruc").innerHTML = objData.structure;
    
    cardDiv.querySelector("#ucPoints").innerHTML = '<b>' + objData.completeTotal + '</b>';

    
    let tagArr = row_tagArrays[newRowId];
    let tagList = cardDiv.querySelector("#ucKeywords");
    // let tagList = "";
    let tagItem;
    for(tagNum in tagArr){
        tagItem = document.createElement('li');
        tagItem.innerHTML = tagInfo.data[parseInt(tagArr[tagNum])].title;
        tagList.appendChild(tagItem);
    }
    cardTable.appendChild(cardDiv);

}