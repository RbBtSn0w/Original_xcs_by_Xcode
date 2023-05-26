function(doc) {
    if (doc.doc_type == 'commit' && doc.integration) {
        if (doc.xcsunittest) {
            emit([doc.xcsunittest, doc.integration], null);
        }
        emit(doc.integration, null);
    }
}
