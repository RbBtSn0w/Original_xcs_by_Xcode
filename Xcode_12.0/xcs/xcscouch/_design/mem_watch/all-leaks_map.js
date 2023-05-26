function(doc) {
    if (doc.doc_type == 'mw_leak') {
	var value = Array.concat([doc.doc_type], doc.date);
        emit(value, null);
    }
}