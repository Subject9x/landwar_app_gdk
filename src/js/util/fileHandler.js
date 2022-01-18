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
            data.tagTotal = document.getElementById(rowItem.id + '_tagTotal').value;
            exportData.data.push(data);
        }
    }
    return exportData;
}