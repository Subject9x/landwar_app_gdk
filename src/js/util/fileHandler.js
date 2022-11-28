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
            data.tags = "";

            let tagArray = row_tagArrays[rowItem.id];
            
            if(tagArray !== undefined && tagArray.length > 0){
                for(let tag in tagArray){
                    data.tags += tagArray[tag] + ' ';    
                }
            }
            else{
                data.tags = "";
            }
            data.tagTotal = parseInt(document.getElementById(rowItem.id + '_tagTotal').innerHTML);
            data.completeTotal = parseInt(document.getElementById(rowItem.id + '_total').innerHTML);
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
            data.completeTotal = parseInt(document.getElementById(rowItem.id + '_total').innerHTML);
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
            $("#" + newRowId + '_name').val(objData.unitName);
            $("#" + newRowId + '_size').val(objData.size);
            $("#" + newRowId + '_move').val(objData.move) ;
            $("#" + newRowId + '_evade').val(objData.evade) ;
            $("#" + newRowId + '_DMGM').val(objData.dmgMelee) ;
            $("#" + newRowId + '_DMGR').val(objData.dmgRange) ;
            $("#" + newRowId + '_range').val(objData.range) ;
            $("#" + newRowId + '_armor').val(objData.armor) ;
            $("#" + newRowId + '_structure').val(objData.structure) ;
            $("#" + newRowId + '_points').val(objData.points) ;

            let newArray = [];
            if(objData.tags.length > 0){
                let txtArray = objData.tags.split(' ');
                for(let i in txtArray){
                    if(txtArray[i].length > 0){
                        newArray.push(parseInt(txtArray[i]));
                    }
                }
            }
            row_tagArrays[newRowId] = newArray;
            ub_row_change_points(newRowId);
            ub_row_tag_validate(newRowId);

            let tagTotal = parseFloat($("#" + newRowId + '_tagTotal')[0].innerHTML)
            let unitTotal = parseFloat($("#" + newRowId + '_points')[0].innerHTML);
            let finalTotal = Math.round(((unitTotal + tagTotal) + Number.EPSILON) * 100) / 100;
            $("#" + newRowId + "_total")[0].innerHTML =  finalTotal;
        }
    }
}

/**
 * 
 * @param {*} fileDataArray 
 */
function file_unitinfo_import(fileDataArray){
    let fileObjData = JSON.parse(fileDataArray);

    for(let objIdx in fileObjData){
        let objData = fileObjData[objIdx];

        if(objData !== undefined){

            let newRowId = uic_row_add();
            $("#" + newRowId + '> #name').append(objData.unitName);
            $("#" + newRowId + '> #size').append(objData.size);
            $("#" + newRowId + '> #move').append(objData.move) ;
            $("#" + newRowId + '> #evade').append(objData.evade) ;
            $("#" + newRowId + '> #melee').append(objData.dmgMelee) ;
            $("#" + newRowId + '> #range').append(objData.dmgRange) ;
            $("#" + newRowId + '> #dist').append(objData.range) ;
            $("#" + newRowId + '> #armor').append(objData.armor) ;
            $("#" + newRowId + '> #struct').append(objData.structure) ;
            $("#" + newRowId + '> #tags').append(objData.newRowId) ;
            $("#" + newRowId + '> #points').append(objData.completeTotal) ;

            let newArray = [];
            if(objData.tags.length > 0){
                let txtArray = objData.tags.split(' ');
                for(let i in txtArray){
                    if(txtArray[i].length > 0){
                        newArray.push(parseInt(txtArray[i]));
                    }
                }
            }
            row_tagArrays[newRowId] = newArray;

            uic_card_row_add(objData, newRowId);
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
    window.api.send('ub-dialog-save-csv', dialogSaveOptionsUnitList, exportData);
}

function file_unitBuild_export_data(htmlUnitTable){
    if(htmlUnitTable.rows.length <= 1){
        return;
    }

    let exportData = file_unitBuild_export_jsonRowArray(htmlUnitTable);
    window.api.send('ub-dialog-send-cardgen', exportData);
}


/*

*/
function file_unitCard_export_pdf(unitCardData){
    let opt = pdfSaveOptions;
    opt.printBackground = true;
    window.api.send('uic-save-sheet', dialogSavePDFOptions, opt, unitCardData);
}