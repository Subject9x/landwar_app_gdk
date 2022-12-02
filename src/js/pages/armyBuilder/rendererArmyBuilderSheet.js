/*
    Renderer.js component for Electron
*/
api.handle( 'ab-dialog-load-response', ( event, data ) => function( event, data ) {
    let parsedData = file_unitInfo_forArmy(data);
    ab_unitInfo_addData(parsedData);
}, event);