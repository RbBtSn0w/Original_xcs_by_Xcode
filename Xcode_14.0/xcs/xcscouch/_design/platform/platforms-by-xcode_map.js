function (doc) {
    if (doc.doc_type === 'platform') {
        emit([doc.xcodeID, doc.identifier], null);
    }
}
