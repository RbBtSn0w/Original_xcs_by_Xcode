function(doc) {
    if (doc.doc_type == 'integration' && doc.currentStep != 'completed') {
        emit(doc.buildServiceFingerprint, null);
    }
}
