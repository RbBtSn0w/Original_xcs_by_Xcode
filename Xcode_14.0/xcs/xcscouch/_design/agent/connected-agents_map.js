function (doc) {
    if (doc.doc_type === 'agent' && doc.connected) {
        emit(doc.name, null);
    }
}
