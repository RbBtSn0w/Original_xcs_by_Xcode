function(doc) {
    if (doc._id && doc.doc_type) {
        emit([doc._id, doc.doc_type], null);
    }
    if (doc.tinyID && doc.doc_type) {
        emit([doc.tinyID, doc.doc_type], null);
    }
}
