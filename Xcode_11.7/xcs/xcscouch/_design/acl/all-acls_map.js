function(doc) {
    if (doc.doc_type == 'acl') {
        if (doc.xcsunittest) {
            emit(doc.xcsunittest, null);
        } else {
            emit('acl', null);
        }
    }
}
