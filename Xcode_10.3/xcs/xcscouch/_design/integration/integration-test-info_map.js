function(doc) {
    if (doc.doc_type == 'test' && doc.integration && doc.keyPath && doc.deviceIdentifier) {
        if (doc.xcsunittest) {
            emit([doc.xcsunittest, doc.integration, doc.keyPath, doc.deviceIdentifier], null);
        }
        emit([doc.integration, doc.keyPath, doc.deviceIdentifier], null);
    }
}
