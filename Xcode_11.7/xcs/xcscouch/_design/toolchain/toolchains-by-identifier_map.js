function (doc) {
    if (doc.doc_type == 'toolchain' && doc.identifier) {
        if (doc.xcsunittest) {
            emit([doc.xcsunittest, doc.identifier], null);
        } else {
            emit(doc.identifier, null);
        }
    }
}
