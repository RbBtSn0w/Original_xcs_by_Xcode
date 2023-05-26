function(doc) {
    if (doc.doc_type == 'integration' && doc.currentStep == 'completed' && doc.bot._id && doc.bot.tinyID) {
        var emitValue = (doc.buildResultSummary.errorCount || 0);
        if (doc.xcsunittest) {
            var value1 = [doc.xcsunittest, doc.bot._id];
            value1 = value1.concat(doc.endedTimeDate);
            emit(value1, emitValue);
        }
        var value1 = [doc.bot._id];
        value1 = value1.concat(doc.endedTimeDate);
        emit(value1, emitValue);
        var value2 = [doc.bot.tinyID];
        value2 = value2.concat(doc.endedTimeDate);
        emit(value2, emitValue);
    }
}
