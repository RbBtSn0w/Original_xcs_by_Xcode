function(doc) {
    if (doc.doc_type == 'test' && doc.integration && doc.deviceIdentifier) {
        if (doc.xcsunittest) {
            emit([doc.xcsunittest, doc.integration, doc.deviceIdentifier], null);
        }
        emit([doc.integration, doc.deviceIdentifier], null);
    }
}
