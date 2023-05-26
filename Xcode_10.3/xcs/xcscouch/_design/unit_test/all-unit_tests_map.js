function(doc) {
    if (doc.xcsunittest) {
        emit(doc.xcsunittest, {
            _id: doc._id,
            _rev: doc._rev
        });
    }
}
