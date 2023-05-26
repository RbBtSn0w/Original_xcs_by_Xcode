function(doc) {
    if (doc.doc_type == 'integration') {
        if (doc.xcsunittest) {
            emit([doc.xcsunittest, doc.currentStep], null);
        }
        emit([doc.currentStep, doc._id], null);
    }
}
