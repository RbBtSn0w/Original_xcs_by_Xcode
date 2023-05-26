function(doc) {
    if ((doc.doc_type == 'integration') && (doc.currentStep != 'completed') && doc.queuedDate) {
        if (doc.xcsunittest) {
            emit([doc.xcsunittest, doc.queuedDate], null);
        }
        emit(doc.queuedDate, null);
    }
}