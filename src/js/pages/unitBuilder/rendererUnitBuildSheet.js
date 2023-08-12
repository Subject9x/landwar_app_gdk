/*
    Renderer.js component for Electron
*/
api.handle( 'ub-dialog-load-response', ( event, ...data ) => function( event, ...data) {
    file_unitBuild_import(data[0]);
    if(data[1] != undefined && data[1].length > 0){

        let path = data[1];
        let fileName = path.substring(path.lastIndexOf('\\') + 1, path.lastIndexOf('.csv'));

        document.getElementById("fileName").innerHTML = "<h3>" + fileName + "</h3>";
    }
}, event);

api.handle( 'ub-dialog-save-response', ( event, ...data ) => function( event, ...data) {
    if(data[0] != undefined && data[0].length > 0){

        let path = data[0];
        let fileName = path.substring(path.lastIndexOf('\\') + 1, path.lastIndexOf('.csv'));

        document.getElementById("fileName").innerHTML = "<h3>" + fileName + "</h3>";
    }
}, event);
