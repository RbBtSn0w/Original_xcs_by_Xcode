function (doc) {
	if (doc.doc_type == 'agent' && doc.fingerprint) {
		emit(doc.fingerprint, null);
	}
}