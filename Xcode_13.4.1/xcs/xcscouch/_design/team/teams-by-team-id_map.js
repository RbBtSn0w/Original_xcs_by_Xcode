function(doc) {
    if (doc.doc_type === 'team') {
        emit(doc.teamID, null);
        emit(doc._id, null);
    }
}