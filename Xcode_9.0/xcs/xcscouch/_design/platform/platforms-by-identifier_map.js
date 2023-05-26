function (doc) {
    if (doc.doc_type == 'platform' && doc.identifier) {
        if (doc.xcsunittest) {
            emit([doc.xcsunittest, doc.identifier], null);
        } else {
            emit(doc.identifier, null);
        }
    }
}
