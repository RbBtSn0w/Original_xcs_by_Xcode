function(doc) {
    if ((doc.doc_type == 'integration') && (doc.result == 'succeeded') && doc.endedTimeDate) {
	var value1 = [doc.bot._id];
	value1 = value1.concat(doc.endedTimeDate);
        emit(value1, 1);
    }
}
