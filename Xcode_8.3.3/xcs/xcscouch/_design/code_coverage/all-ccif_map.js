function (doc) {
    if (doc.doc_type == 'ccif' && doc.integrationID && doc.kph) {
        var index = doc.kph.slice();
        emit(index, null);
    }
}