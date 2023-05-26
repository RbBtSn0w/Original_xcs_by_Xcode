function(doc) {
    if (doc.doc_type == 'bot_issue') {
        if (doc.xcsunittest) {
            emit([doc.xcsunittest, doc.hashVersion, doc.botID, doc.hash], null);
        }
        emit([doc.hashVersion, doc.botID, doc.hash], null);
    }
}
