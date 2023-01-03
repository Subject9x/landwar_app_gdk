/*
    Renderer.js component for Electron
*/
api.handle( 'ub-dialog-load-response', ( event, data ) => function( event, data, filePath) {
    file_unitBuild_import(data);
    if(filePath != undefined && filePath.length > 0){

        let path = filePath;
        let fileName = path.substring(path.lastIndexOf('\\') + 1, path.lastIndexOf('.csv'));

        document.getElementById("fileName").innerHTML = "<h3>" + fileName + "</h3>";
    }
}, event);

api.handle( 'ub-dialog-save-response', ( event, data ) => function( event, filePath) {
    if(filePath != undefined && filePath.length > 0){

        let path = filePath;
        let fileName = path.substring(path.lastIndexOf('\\') + 1, path.lastIndexOf('.csv'));

        document.getElementById("fileName").innerHTML = "<h3>" + fileName + "</h3>";
    }
}, event);
