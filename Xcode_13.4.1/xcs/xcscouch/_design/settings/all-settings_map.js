function(doc) {
    if (doc.doc_type == 'settings') {
        if (doc.xcsunittest) {
            emit(doc.xcsunittest, null);
        } else {
            emit('settings', null);
        }
    }
}
