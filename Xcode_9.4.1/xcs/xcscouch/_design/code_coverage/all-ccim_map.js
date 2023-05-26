function(doc) {
	if (doc.doc_type == 'ccim' && doc.integrationID) {
		emit([doc.doc_type, doc.integrationID], null);
	}
}