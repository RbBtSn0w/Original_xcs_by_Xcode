function(doc) {
    if (doc.doc_type == 'integration') {
        if (doc.xcsunittest) {
            if (doc.bot._id) {
                emit([doc.xcsunittest, doc.bot._id], null);
            }
            if (doc.bot.tinyID) {
                emit([doc.xcsunittest, doc.bot.tinyID], null);
            }
        } else {
            if (doc.bot._id) {
                emit(doc.bot._id, {
                    _id: doc._id,
                    _rev: doc._rev
                });
            }
            if (doc.bot.tinyID) {
                emit(doc.bot.tinyID, {
                    _id: doc._id,
                    _rev: doc._rev
                });
            }
        }
    }
}
