function(doc) {
	if (doc.doc_type == 'integration' && doc.currentStep == 'completed' && doc.bot._id && doc.number && doc.buildResultSummary.codeCoveragePercentage) {
		if (doc.xcsunittest) {
			var value1 = [doc.xcsunittest, doc.bot._id];
			value1 = value1.concat(doc.endedTimeDate);
			emit(value1, {
				"number": doc.number,
				"codeCoveragePercentage": doc.buildResultSummary.codeCoveragePercentage
			});
		}
		var value1 = [doc.bot._id];
		value1 = value1.concat(doc.endedTimeDate);
		emit(value1, {
			"number": doc.number,
			"codeCoveragePercentage": doc.buildResultSummary.codeCoveragePercentage
		});
	}
}
