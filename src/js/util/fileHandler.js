/*
    Utility functions for File i/o

*/
/*
    unitBuilder->EXPORT->JSON from UnitRow table to Array of JSON obj.
        this is for csv-writer compat.
*/
function file_unitBuild_export_jsonRowArray(htmlUnitTable){
    let exportData = [];
    if(htmlUnitTable.rows.length <= 1){
        return exportData;
    }

    for(i = 1; i < htmlUnitTable.rows.length; i++){
        let rowItem = htmlUnitTable.rows[i];
        let select = document.getElementById(rowItem.id + '_select').checked;
        if(select){
            let data = {};
            data.unitName = document.getElementById(rowItem.id + '_name').value;
            data.size = parseInt(document.getElementById(rowItem.id + '_size').value);
            data.move = parseInt(document.getElementById(rowItem.id + '_move').value);
            data.evade = parseInt(document.getElementById(rowItem.id + '_evade').value);
            data.dmgMelee = parseInt(document.getElementById(rowItem.id + '_DMGM').value);
            data.dmgRange = parseInt(document.getElementById(rowItem.id + '_DMGR').value);
            data.range = parseInt(document.getElementById(rowItem.id + '_range').value);
            data.armor = parseInt(document.getElementById(rowItem.id + '_armor').value);
            data.structure = parseInt(document.getElementById(rowItem.id + '_structure').value);
            data.points = parseInt(document.getElementById(rowItem.id + '_points').innerHTML);
            
            let tagArray = row_tagArrays[rowItem.id];
            if(tagArray !== undefined && tagArray.length > 0){
                data.tags = tagArray;
            }
            else{
                data.tags = '';
            }
            data.tagTotal = parseInt(document.getElementById(rowItem.id + '_tagTotal').innerHTML);
            exportData.push(data);
        }
    }
    return exportData;
}

/*
    unitBuilder->EXPORT->JSON from UnitRow table to FILE

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
            data.size = parseInt(document.getElementById(rowItem.id + '_size').value);
            data.move = parseInt(document.getElementById(rowItem.id + '_move').value);
            data.evade = parseInt(document.getElementById(rowItem.id + '_evade').value);
            data.dmgMelee = parseInt(document.getElementById(rowItem.id + '_DMGM').value);
            data.dmgRange = parseInt(document.getElementById(rowItem.id + '_DMGR').value);
            data.range = parseInt(document.getElementById(rowItem.id + '_range').value);
            data.armor = parseInt(document.getElementById(rowItem.id + '_armor').value);
            data.structure = parseInt(document.getElementById(rowItem.id + '_structure').value);
            data.points = parseInt(document.getElementById(rowItem.id + '_points').innerHTML);
            
            let tagArray = row_tagArrays[rowItem.id];
            if(tagArray !== undefined && tagArray.length > 0){
                data.tags = tagArray;
            }
            else{
                data.tags = '';
            }
            data.tagTotal = parseInt(document.getElementById(rowItem.id + '_tagTotal').innerHTML);
            exportData.push(data);
        }
    }
    return exportData;
}


/*
    unitBuilder->IMPORT->JSON to UnitRow Table
        assumes [] of json objects.

    todo - fileDataObj.data[] for 'single unit' / 'army list' files.
*/
function file_unitBuild_import(fileDataArray){
    let fileDataObj = JSON.parse(fileDataArray);

    for(let objIdx in fileDataObj){
        let objData = fileDataObj[objIdx];
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

            let newArray = [];
            if(objData.tags.length > 0){
                newArray = JSON.parse(objData.tags);
            }
            row_tagArrays[newRowId] = newArray;
            ub_row_change_points(newRowId);
            ub_row_tag_validate(newRowId);
        }
    }
}


/*
    unitBuilder->EXPORT->CSV from UnitRow table to FILE
        invokes ('csv-writer') dependency for ops.
*/
function file_unitBuild_export_csv(htmlUnitTable){
    if(htmlUnitTable.rows.length <= 1){
        return;
    }

    let exportData = file_unitBuild_export_jsonRowArray(htmlUnitTable);
    //window.dialogSys.ubSaveDialog(exportData, dialogSaveOptionsUnitList);
    window.api.send('ub-dialog-save-csv', dialogLoadOptionsUnitList, exportData)
}
