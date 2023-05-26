function (doc) {
    if (doc.doc_type === 'xcode') {
        emit([doc.agentID, doc.primary ? 0 : 1], null);
    }
}
