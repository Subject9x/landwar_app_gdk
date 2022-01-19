/*
    Utility functions for File i/o

*/

/*
    unitBuilder->export row data to a text file.

*/
function file_unitBuild_export(htmlUnitTable){
    let exportData = {};

    if(htmlUnitTable.rows.length <= 1){
        return;
    }

    exportData["header"] = {
        appName : 'LANDWAR-GDK',
        version : '0.0.1',
        rules : 'LANDWAR Core v0.037'
    };

    exportData["data"] = [];
    for(i = 1; i < htmlUnitTable.rows.length; i++){
        let rowItem = htmlUnitTable.rows[i];
        let select = document.getElementById(rowItem.id + '_select').checked;
        if(select){
            let data = {};
            data.unitName = document.getElementById(rowItem.id + '_name').value;
            data.size = document.getElementById(rowItem.id + '_size').value;
            data.move = document.getElementById(rowItem.id + '_move').value;
            data.evade = document.getElementById(rowItem.id + '_evade').value;
            data.dmgMelee = document.getElementById(rowItem.id + '_DMGM').value;
            data.dmgRange = document.getElementById(rowItem.id + '_DMGR').value;
            data.range = document.getElementById(rowItem.id + '_range').value;
            data.armor = document.getElementById(rowItem.id + '_armor').value;
            data.structure = document.getElementById(rowItem.id + '_structure').value;
            data.points = document.getElementById(rowItem.id + '_points').value;
            
            let tagArray = row_tagArrays[rowItem.id];
            if(tagArray !== undefined && tagArray.length > 0){
                data.tags = tagArray;
            }
            else{
                data.tags = []
            }
            data.tagTotal = document.getElementById(rowItem.id + '_tagTotal').value;
            exportData.data.push(data);
        }
    }
    return exportData;
}

/*
    unitBuilder-> import json data file to rows.
*/
function file_unitBuild_import(fileData){
    let fileDataObj = JSON.parse(fileData);

    for(let objIdx in fileDataObj.data){
        let objData = fileDataObj.data[objIdx];
        if(objData !== undefined){
            let newRowId = ub_row_add();
            document.getElementById(newRowId + '_name').value = objData.unitName;
            document.getElementById(newRowId + '_size').value = objData.size;
            document.getElementById(newRowId + '_move').value = objData.move;
            document.getElementById(newRowId + '_evade').value = objData.evade;
            document.getElementById(newRowId + '_DMGM').value = objData.dmgMelee;
            document.getElementById(newRowId + '_DMGR').value = objData.dmgRange;
            document.getElementById(newRowId + '_range').value = objData.range;
            document.getElementById(newRowId + '_armor').value = objData.armor;
            document.getElementById(newRowId + '_structure').value = objData.structure;
            document.getElementById(newRowId + '_points').value = objData.points;
            row_tagArrays[newRowId]=objData.tags
            ub_row_change_points(newRowId);
            ub_row_tag_validate(newRowId);
        }
    }
}