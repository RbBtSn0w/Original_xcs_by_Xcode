function(doc) {
    if ((doc.doc_type == 'device') && doc.isServer) {
        emit(doc.doc_type, null);
    }
}
