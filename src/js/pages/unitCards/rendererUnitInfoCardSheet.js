/*
    Renderer.js component for Electron
*/

api.handle('uic-dialog-load-response', ( event, data ) => function( event, data ) {
    
    file_unitinfo_import(data);
    uic_window_setData(data);
});


api.handle('uic-finish-print', ( event, data ) => function( event, data ) {
    
});