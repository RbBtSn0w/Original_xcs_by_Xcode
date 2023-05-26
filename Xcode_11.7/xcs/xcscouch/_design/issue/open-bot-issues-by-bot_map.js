function(doc) {
    if (doc.doc_type == 'bot_issue') {
        var streak = doc.streaks[doc.streaks.length - 1];
        if (streak.open) {
            if (doc.xcsunittest) {
                emit([doc.xcsunittest, doc.botID], null);
            }
            emit(doc.botID, null);
        }
    }
}
