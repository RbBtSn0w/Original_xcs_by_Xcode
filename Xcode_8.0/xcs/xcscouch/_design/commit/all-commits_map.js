function(doc) {
    if (doc.doc_type == 'commit') {
        if (doc.xcsunittest) {
            emit([doc.xcsunittest, doc._id], {
                _id: doc._id,
                _rev: doc._rev
            });
        }
        emit(doc._id, {
            _id: doc._id,
            _rev: doc._rev
        });
    }
}
