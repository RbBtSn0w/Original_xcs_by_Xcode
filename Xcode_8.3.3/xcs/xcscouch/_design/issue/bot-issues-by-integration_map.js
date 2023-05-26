function(doc) {
    if (doc.doc_type == 'bot_issue') {
        doc.streaks.forEach(function(streak) {
            var commits = [];
            var issueAuthors = [];
            streak.records.forEach(function(record, index) {
                if (record.commits) {
                    var commitsToAdd = record.commits.map(function(c) {
                        c = JSON.parse(JSON.stringify(c));
                        delete c.XCSCommitCommitChangeFilePaths;
                        return c;
                    });
                    commits = commits.concat(commitsToAdd);
                }
                if (record.issueAuthors) {
                    issueAuthors = issueAuthors.concat(record.issueAuthors);
                }

                var documentToEmit = {
                    _id: doc._id,
                    _rev: doc._rev,
                    message: record.message,
                    type: doc.type,
                    fixItType: doc.fixItType,
                    issueType: doc.issueType,
                    commits: commits,
                    target: doc.target,
                    testCase: doc.testCase,
                    documentFilePath: doc.documentFilePath,
                    documentLocationData: record.documentLocationData,
                    lineNumber: record.lineNumber,
                    integrationID: streak.records[0].integration._id,
                    age: (record.integration.number - streak.records[0].integration.number),
                    status: (record.integration._id == streak.records[0].integration._id) ? 0 : 1,
                    silenced: doc.silenced || streak.silenced || record.silenced,
                    assignee: streak.assignee || undefined,
                    associations: streak.associations || undefined,
                    issueAuthors: issueAuthors,
                    cause: streak.records[0].cause
                };
                if (doc.xcsunittest) {
                    emit([doc.xcsunittest, record.integration._id], documentToEmit);
                }
                emit(record.integration._id, documentToEmit);
            });
            if (!streak.open) {
                var integration = streak.closedByIntegration,
                    lastRecord = streak.records[streak.records.length - 1],
                    closedDocument = {
                        _id: doc._id,
                        _rev: doc._rev,
                        message: lastRecord.message,
                        type: doc.type,
                        fixItType: doc.fixItType,
                        issueType: doc.issueType,
                        commits: commits,
                        target: doc.target,
                        testCase: doc.testCase,
                        documentFilePath: doc.documentFilePath,
                        documentLocationData: lastRecord.documentLocationData,
                        lineNumber: lastRecord.lineNumber,
                        integrationID: streak.records[0].integration._id,
                        age: (streak.closedByIntegration.number - streak.records[0].integration.number),
                        status: 2,
                        silenced: doc.silenced || streak.silenced || lastRecord.silenced,
                        assignee: streak.assignee || undefined,
                        associations: streak.associations || undefined,
                        issueAuthors: issueAuthors,
                        cause: streak.records[0].cause
                    };
                if (doc.xcsunittest) {
                    emit([doc.xcsunittest, streak.closedByIntegration._id], closedDocument);
                }
                emit(streak.closedByIntegration._id, closedDocument);
            }
        });
    }
}
