function(doc) {
    if (doc.doc_type == 'file') {
		emit([doc.integrationID, doc.fileName], doc.size);
    }
}