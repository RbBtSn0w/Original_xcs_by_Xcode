function(doc) {
	if (doc.doc_type == 'integration' && doc.currentStep == 'completed' && doc.bot._id && doc.number) {
		if (doc.xcsunittest) {
			var value1 = [doc.xcsunittest, doc.bot._id];
			value1 = value1.concat(doc.endedTimeDate);
			if (doc.buildResultSummary.codeCoveragePercentage) {
				emit(value1, {
					"number": doc.number,
					"codeCoveragePercentage": doc.buildResultSummary.codeCoveragePercentage
				});
			} else {
				emit(value1, {
					"number": doc.number
				});
			}
		}
		var value1 = [doc.bot._id];
		value1 = value1.concat(doc.endedTimeDate);
		if (doc.buildResultSummary.codeCoveragePercentage) {
			emit(value1, {
				"number": doc.number,
				"codeCoveragePercentage": doc.buildResultSummary.codeCoveragePercentage
			});
		} else {
			emit(value1, {
				"number": doc.number
			});
		}
	}
}
