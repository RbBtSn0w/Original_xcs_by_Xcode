function(doc) {
    if ((doc.doc_type == 'integration') && (doc.result == 'succeeded')) {
        if (doc.xcsunittest) {
            emit([doc.xcsunittest, doc.bot._id, doc.success_streak], {
                integrationID: doc._id,
                success_streak: doc.success_streak,
                endedTime: doc.endedTime
            });
            emit([doc.xcsunittest, doc.bot.tinyID, doc.success_streak], {
                integrationID: doc._id,
                success_streak: doc.success_streak,
                endedTime: doc.endedTime
            });
        }
        emit([doc.bot._id, doc.success_streak], {
            integrationID: doc._id,
            success_streak: doc.success_streak,
            endedTime: doc.endedTime
        });
        emit([doc.bot.tinyID, doc.success_streak], {
            integrationID: doc._id,
            success_streak: doc.success_streak,
            endedTime: doc.endedTime
        });
    }
}
