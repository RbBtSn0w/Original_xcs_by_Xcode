function(doc) {
	if (doc.doc_type == 'mw_stats') {
		var value = Array.concat([doc.doc_type], doc.date);
		emit(value, null);
	}
}
