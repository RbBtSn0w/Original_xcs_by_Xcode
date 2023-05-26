function(doc) {
    if (doc.doc_type == 'issue' && doc.integration) {
        if (doc.xcsunittest) {
            emit([doc.xcsunittest, doc.integration], null);
        }
        emit(doc.integration, null);
    }
}
