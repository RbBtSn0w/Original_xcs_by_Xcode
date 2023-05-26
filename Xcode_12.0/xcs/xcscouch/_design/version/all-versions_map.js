function(doc) {
    if (doc.doc_type == 'version') {
        if (doc.xcsunittest) {
            emit(doc.xcsunittest, null);
        } else {
            emit('version', null);
        }
    }
}
