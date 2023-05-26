function(doc) {
    if (doc.doc_type == 'integration' && doc.number && doc.bot._id && (doc.tags.length > 0)) {
        if (doc.bot._id) {
            for (var i = 0; i < doc.tags.length; i++) {
                if (doc.xcsunittest) {
                    emit([doc.xcsunittest, doc.bot._id, doc.tags[i], doc.number], doc.number);
                } else {
                    emit([doc.bot._id, doc.tags[i], doc.number], doc.number);
                }
            }
        }
        if (doc.bot.tinyID) {
            for (var i = 0; i < doc.tags.length; i++) {
                if (doc.xcsunittest) {
                    emit([doc.xcsunittest, doc.bot.tinyID, doc.tags[i], doc.number], doc.number);
                } else {
                    emit([doc.bot.tinyID, doc.tags[i], doc.number], doc.number);
                }
            }
        }
    }
}
