function(doc) {
	if (doc.xcsunittest) {
		emit([doc.xcsunittest, doc.doc_type, doc._id], null);
	} else {
		emit([doc.doc_type, doc._id], null);
	}
}
