/*
    Renderer.js component for Electron
*/
api.handle( 'uic-dialog-load-response', ( event, data ) => function( event, data ) {
    file_unitinfo_import(data);
}, event);

