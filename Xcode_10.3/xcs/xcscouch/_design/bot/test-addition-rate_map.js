function(doc) {
    if (doc.doc_type == 'integration' && doc.bot._id && doc.bot.tinyID && doc.endedTimeDate && doc.buildResultSummary) {
        if (doc.xcsunittest) {
            var value1 = [doc.xcsunittest, doc.bot._id];
            value1 = value1.concat(doc.endedTimeDate);
            emit(value1, doc.buildResultSummary.testsChange);
            var value2 = [doc.xcsunittest, doc.bot.tinyID];
            value2 = value2.concat(doc.endedTimeDate);
            emit(value2, doc.buildResultSummary.testsChange);
        }
        var value1 = [doc.bot._id];
        value1 = value1.concat(doc.endedTimeDate);
        emit(value1, doc.buildResultSummary.testsChange);
        var value2 = [doc.bot.tinyID];
        value2 = value2.concat(doc.endedTimeDate);
        emit(value2, doc.buildResultSummary.testsChange);
    }
}
