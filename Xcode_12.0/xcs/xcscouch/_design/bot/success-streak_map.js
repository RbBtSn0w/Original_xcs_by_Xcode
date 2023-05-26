function(doc) {
	if ((doc.doc_type == 'integration') && (doc.result == 'succeeded') && doc.endedTimeDate) {
		if (doc.xcsunittest) {
			var value1 = [doc.xcsunittest, doc.bot._id];
			value1 = value1.concat(doc.endedTimeDate);
			emit(value1, {
				integrationID: doc._id,
				success_streak: doc.success_streak,
				endedTime: doc.endedTime
			});
		} else {
			var value1 = [doc.bot._id];
			value1 = value1.concat(doc.endedTimeDate);
			emit(value1, {
				integrationID: doc._id,
				success_streak: doc.success_streak,
				endedTime: doc.endedTime
			});
		}
	}
}
