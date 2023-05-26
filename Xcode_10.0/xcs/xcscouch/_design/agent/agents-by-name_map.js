function (doc) {
	if (doc.doc_type == 'agent' && doc.name) {
		emit(doc.name, null);
	}
}
