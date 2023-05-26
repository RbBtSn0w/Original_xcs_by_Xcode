function(doc) {
    if ((doc.doc_type == 'integration') && (doc.result == 'succeeded')) {
        if (doc.xcsunittest) {
            emit([doc.xcsunittest, doc.bot._id, doc.endedTime], {
                integrationID: doc._id,
                endedTime: doc.endedTime
            });
            emit([doc.xcsunittest, doc.bot.tinyID, doc.endedTime], {
                integrationID: doc._id,
                endedTime: doc.endedTime
            });
        }
        emit([doc.bot._id, doc.endedTime], {
            integrationID: doc._id,
            endedTime: doc.endedTime
        });
        emit([doc.bot.tinyID, doc.endedTime], {
            integrationID: doc._id,
            endedTime: doc.endedTime
        });
    }
}
