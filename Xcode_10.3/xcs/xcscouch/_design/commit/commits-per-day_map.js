function(doc) {
    if (doc.doc_type == 'commit' && doc.commits && doc.botID) {
        for (var key in doc.commits) {
            if (doc.commits.hasOwnProperty(key)) {
                var some_commits = doc.commits[key];
                for (var i = 0; i < some_commits.length; i++) {
                    if (doc.xcsunittest) {
                        var value1 = [doc.xcsunittest, doc.botID];
                        value1 = value1.concat(some_commits[i].XCSCommitTimestampDate);
                        emit(value1, some_commits.length);
                        var value2 = [doc.xcsunittest, doc.botTinyID];
                        value2 = value2.concat(some_commits[i].XCSCommitTimestampDate);
                        emit(value2, some_commits.length);
                    }
                    var value1 = [doc.botID];
                    value1 = value1.concat(some_commits[i].XCSCommitTimestampDate);
                    emit(value1, some_commits.length);
                    var value2 = [doc.botTinyID];
                    value2 = value2.concat(some_commits[i].XCSCommitTimestampDate);
                    emit(value2, some_commits.length);
                }
            }
        }
    }
}
