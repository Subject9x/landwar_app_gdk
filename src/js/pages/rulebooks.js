/*
    RULEBOOK PAGE FUNCTIONS
*/

function rb_rules_open_core(){
    window.api.send('rb-open-rules-core');
}

function rb_rules_open_quickplay(){
    window.api.send('rb-open-rules-quick');
}

function rb_rules_pdf_core(){
    window.api.send('rb-save-rules-core', dialogSavePDFOptions, pdfSaveOptions);
}

function rb_rules_pdf_quick(){
    window.api.send('rb-save-rules-quick', dialogSavePDFOptions, pdfSaveOptions);
}