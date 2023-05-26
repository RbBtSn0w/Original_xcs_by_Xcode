function(doc) {
    if (doc.doc_type == 'integration' && doc.number && doc.bot._id) {
        if (doc.xcsunittest) {
            if (doc.bot._id) {
                emit([doc.xcsunittest, doc.bot._id, doc.number], doc.number);
            }
            if (doc.bot.tinyID) {
                emit([doc.xcsunittest, doc.bot.tinyID, doc.number], doc.number);
            }
        }
        if (doc.bot._id) {
            emit([doc.bot._id, doc.number], doc.number);
        }
        if (doc.bot.tinyID) {
            emit([doc.bot.tinyID, doc.number], doc.number);
        }
    }
}
