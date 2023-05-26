function(doc) {
    if (doc.doc_type == 'integration' && doc.number && doc.bot._id && doc.result) {
        if (doc.bot._id && (doc.result !== 'succeeded')) {
            if (doc.xcsunittest) {
                emit([doc.xcsunittest, doc.bot._id, doc.result, doc.number], doc.number);
            } else {
                emit([doc.bot._id, doc.result, doc.number], doc.number);
            }
        }
        if (doc.bot.tinyID && (doc.result !== 'succeeded')) {
            if (doc.xcsunittest) {
                emit([doc.xcsunittest, doc.bot.tinyID, doc.result, doc.number], doc.number);
            } else {
                emit([doc.bot.tinyID, doc.result, doc.number], doc.number);
            }
        }
    }
}
