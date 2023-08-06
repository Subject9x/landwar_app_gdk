/*
    Renderer.js component for Electron
*/
api.handle( 'ab-dialog-load-response', ( event, data ) => function( event, data, filePath) {
    let parsedData = file_unitInfo_forArmy(data);
    ab_armyList_parseData(parsedData);
    if(filePath != undefined && filePath.length > 0){

        let path = filePath;
        let fileName = path.substring(path.lastIndexOf('\\') + 1, path.lastIndexOf('.csv'));
        
        document.getElementById("fileName").innerHTML = "<h4>" + fileName + "</h4>";
        document.getElementById("file").innerHTML = fileName;
    }
}, event);

api.handle( 'ab-dialog-load-response-unitinfo', (event, data) => function(event, data){
    let parsedData = file_unitInfo_forArmy(data);
    ab_unitInfo_addData(parsedData);
}, event);
