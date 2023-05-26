'use strict';

var handlebars = require('handlebars'),
    _ = require('underscore'),
    k = require('../constants.js');

function pluralize(count, str, includeCount) {

    if (includeCount === undefined) {
        includeCount = true;
    }

    // not very intelligent, but good enough for us
    var lastChar = str.split('').pop();
    if (lastChar === 'y') {
        return '' + (includeCount?count:'') + ' ' + (count === 1 ? str : str + 'ies');
    }
    else {
        return '' + (includeCount?count:'') + ' ' + (count === 1 ? str : str + 's');
    }
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function humanize(str) {
    return str.split(/([A-Z][a-z]+)/).map(capitalize).join(' ').trim();
}

function htmlEscape(inString) {
	if (inString !== undefined && inString !== null) {
		return handlebars.Utils.escapeExpression(inString);
	}
	else {
		return '';
	}
}

function filePathMessage(issue) {
    if (issue.documentFilePath) {
        var fileName = issue.documentFilePath;
        if (issue.lineNumber) {
            fileName += ':' + issue.lineNumber;
        }
        return ' in ' + htmlEscape(fileName);
    }
    return ': ';
}

function issueMessage(issue) {
    var message = issue.message;
    var rawMessageArray = message.split('\n');
    var rawMessage = '';
    var doNotDisplayIssueTypes = ['buildServiceWarning', 'buildServiceError', 'triggerError'];

    for (var i = 0; i < 5; i++) {
        if (typeof (rawMessageArray[i]) !== 'undefined') {
            if (i > 0) {
                rawMessage += '<br />\n';
            }
            rawMessage += htmlEscape(rawMessageArray[i]);
        }
    }

    if (issue.testCase) {
        return '<code>' + htmlEscape(issue.testCase) + '</code><br>\n' + rawMessage;
    }

    if (doNotDisplayIssueTypes.indexOf(issue.issueType) !== -1) {
        return  rawMessage;
    }
    else {
        return htmlEscape(issue.issueType) + ': ' + rawMessage;
    }
}

function renderContributor(contributor) {
    var name = _.escape((contributor && contributor.XCSContributorDisplayName) || (contributor && contributor.XCSContributorName) || ""),
        email = _.escape((contributor && contributor.XCSContributorEmails && _.first(contributor.XCSContributorEmails)) || "");

    if (name && name.length !== 0) {
        return new handlebars.SafeString('<a href="mailto:' + email + '">' + name + '</a>');
    } else if (email.indexOf('@') !== -1) {
        return new handlebars.SafeString('<a href="mailto:' + email + '">' + email + '</a>');
    } else {
        return new handlebars.SafeString(email);
    }
}

function getContributorEmail(contributor) {
    var email = _.escape((contributor && contributor.XCSContributorEmails && _.first(contributor.XCSContributorEmails)) || "");
    return email;
}

function commit_message(message) {
    if (message !== undefined && message !== null) {
        var messageArray = message.trim().split("\n");
        var finalMessage = "";
        for (var i = 0; i < messageArray.length; i++) {
            var newMessage = messageArray[i];
            newMessage = htmlEscape(newMessage.trim());

            if (i === 0) {
                finalMessage += newMessage;
            }
            else {
                finalMessage += "<br>" + newMessage;
            }
        }
        return new handlebars.SafeString(finalMessage);
    }
    else {
        return "";
    }
}

function getColor(color) {
    var colors = {
        'error': 'rgb(200, 37, 6)',
        'warning': 'rgb(195, 151, 26)',
        'analyzerWarning': 'rgb(3, 101, 192)',
        'testFailure': 'rgb(200, 37, 6)',
        'resolved': 'rgb(160, 160, 160)',
        'buildServiceWarning': 'rgb(195, 151, 26)',
        'buildServiceError': 'rgb(200, 37, 6)',
        'triggerError': 'rgb(200, 37, 6)'
    };

    if (colors[color] !== undefined) {
        return colors[color];
    }
    else {
        return "#000";
    }
}

function issue_type_introduction(issue) {
    var returnString = "";
    var color = issue.status === 2 ? getColor('resolved') : getColor(issue.type);
    returnString += '<span style="color: '+ color +'; font-weight: bold;">'+ humanize(issue_type_dispay_name(issue.type)) +'</span>';
    return new handlebars.SafeString(returnString);
}

function issue_type_dispay_name(issueType) {
    var issueTypeDisplayName = "";
    if (issueType) {
        switch(issueType) {
            case "testFailure":
                issueTypeDisplayName = "testAssertion";
                break;
            default:
                issueTypeDisplayName = issueType;
        }
    }
    return issueTypeDisplayName;
}

function issue_file_path_introduction(issue) {
    var returnString = "";
    returnString += '<span class="issue_file_path" style="word-break:break-all;">'+ filePathMessage(issue) +'</span>';
    return new handlebars.SafeString(returnString);
}

function issue_message(issue) {
    return new handlebars.SafeString(issueMessage(issue));
}

function formatDate(timestamp) {
    if (timestamp !== undefined && timestamp !== null) {
        var date = new Date(timestamp);
        if (!isNaN(date)) {
            var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0'+minutes : minutes;
            seconds = seconds < 10 ? '0'+seconds : seconds;

            return months[date.getMonth()]+" "+ date.getDate() +", "+ date.getFullYear() +" "+ hours+":"+minutes+" "+ampm;
        }
        else {
            return new handlebars.SafeString(timestamp);
        }
    }
    else {
        return "";
    }
}

function fullWordsDate(timestamp) {
    if (timestamp !== undefined && timestamp !== null) {
        var date = new Date(timestamp);
        if (!isNaN(date)) {
            var months = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
            var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            var daysEnding = ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"];

            var dateNumber = "";
            if (date.getDate() < 11 || date.getDate() > 19) {
                dateNumber = date.getDate()+daysEnding[date.getDate()%10];
            }
            else {
                dateNumber = date.getDate()+"th";
            }

            return days[date.getDay()]+" "+months[date.getMonth()]+" "+dateNumber;
        }
        else {
            return "";
        }
    }
    else {
        return "";
    }
}

function fullWordsDateWithTime(timestamp) {
    if (timestamp !== undefined && timestamp !== null) {
        var date = new Date(timestamp);
        if (!isNaN(date)) {
            var months = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
            var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            var daysEnding = ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"];

            var dateNumber = "";
            if (date.getDate() < 11 || date.getDate() > 19) {
                dateNumber = date.getDate()+daysEnding[date.getDate()%10];
            }
            else {
                dateNumber = date.getDate()+"th";
            }

            var hours = date.getHours();
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0'+minutes : minutes;
            seconds = seconds < 10 ? '0'+seconds : seconds;

            return days[date.getDay()]+" "+months[date.getMonth()]+" "+dateNumber+" "+ hours+":"+minutes+" "+ampm;
        }
        else {
            return "";
        }
    }
    else {
        return "";
    }
}

function trimString(string, size) {
    var trimSize;
    if (size !== undefined) {
        trimSize = size;
    }
    else {
        trimSize = 50;
    }
    if (string !== undefined && string !== null && string.length) {
        if (string.length > trimSize) {
            string = string.substring(0, trimSize) + "...";
        }
    }
}

function stringifyArray(array, lastLink) {
    var finalString = "";
    for (var k = 0; k < array.length; k++) {
        var string = array[k];
        if (k === 0) {
            finalString += string;
        }
        if (k > 0 && k !== array.length-1) {
            finalString += ", ";
            finalString += string;
        }
        if (k > 0 && k === array.length-1) {
            if (lastLink === undefined) {
                finalString += " and ";
            }
            else {
                finalString += ` ${lastLink} `;
            }
            finalString += string;
        }
    }
    return finalString;
}

function commaSeperatedArrayToString(array) {
    var finalString = "";
    for (var k = 0; k < array.length; k++) {
        var string = array[k];
        if (k === 0) {
            finalString += string;
        }
        if (k > 0) {
            finalString += ", ";
            finalString += string;
        }
    }
    return finalString;
}

function getAssociation(issue, type) {
    return issue.associations && issue.associations[type];
}

function introducedBy(issue, potentially) {
    let str = 'introduced';
    if (potentially) {
        str = 'potentially resolvable';
    }
    if (!potentially && issue.age > 0) {
        str += ` ${pluralize(issue.age, "integration")} ago`;
    }
    str += " by ";
    return str;
}

function issueIntroducedBy(issue, commitsByHash) {
    var message = "";
    var messageArray = [];
    if (issue) {
        var assignee = getAssociation(issue, 'assignee');

        var lowConfidenceCommittersDict = {};
        var highConfidenceCommittersDict = {};
        var highConfidenceCommittersArray = [];
        var lowConfidenceCommittersArray = [];
        var highConfidenceFound = false;

        if (issue.cause) {
            let cause = issue.cause;

            if (cause.type === 1) {
                let str = `${introducedBy(issue, false)}Xcode upgrade`;

                if (cause.xcodeChanges) {
                    let x = cause.xcodeChanges;

                    if (x.version && x.buildNumber) {
                        str += ` from ${x.version.before} (${x.buildNumber.before}) to ${x.version.after} (${x.buildNumber.after})`;
                    } else if (x.version) {
                        str += ` from ${x.version.before} to ${x.version.after}`;
                    } else {
                        str += ` from ${x.buildNumber.before} to ${x.buildNumber.after}`;
                    }
                }

                messageArray.push(str);
            } else if (cause.type === 2) {
                let str = introducedBy(issue, false);

                if (cause.key === 'performsAnalyzeAction') {
                    str += 'enabling static analysis';
                } else if (cause.key === 'performsTestAction') {
                    str += 'enabling testing';
                } else {
                    str += 'bot configuration changes';
                }

                messageArray.push(str);
            }
        } else if (issue.issueAuthors && issue.issueAuthors.length > 0) {
            for (var i = 0; i < issue.issueAuthors.length; i++) {
                var issueAuthor = issue.issueAuthors[i];
                var strategy = issueAuthor.XCSIssueSuspectstrategy;
                var commit = commitsByHash[issueAuthor.XCSCommitHash];

                if (commit) {
                    var contributor = commit.XCSCommitContributor;
                    var contributorEmail = getContributorEmail(contributor);

                    if (strategy.confidence === k.XCSIssueIdentificationStrategyHighConfidence) {
                        highConfidenceFound = true;

                        if (highConfidenceCommittersDict[contributorEmail] !== undefined) {
                            var contributorDict = highConfidenceCommittersDict[contributorEmail];

                            if (contributorDict.issueAuthor.length > 0) {
                                var issueAuthorDict = contributorDict.issueAuthor[0];
                                var strategyDict = issueAuthorDict.XCSIssueSuspectstrategy;

                                if (strategyDict.reliability < strategy.reliability) {
                                    highConfidenceCommittersDict[contributorEmail] = {
                                        contributor: contributor,
                                        issueAuthor: [issueAuthor],
                                        email: contributorEmail
                                    };
                                }
                                else if (strategyDict.reliability === strategy.reliability) {
                                    var issueAuthorArray = contributorDict.issueAuthor;
                                    issueAuthorArray.push(issueAuthor);

                                    highConfidenceCommittersDict[contributorEmail] = {
                                        contributor: contributor,
                                        issueAuthor: issueAuthorArray,
                                        email: contributorEmail
                                    };
                                }
                            }
                        }
                        else {
                            highConfidenceCommittersDict[contributorEmail] = {
                                contributor: contributor,
                                issueAuthor: [issueAuthor],
                                email: contributorEmail
                            };
                        }
                    }
                    else if (strategy.confidence === k.XCSIssueIdentificationStrategyLowConfidence && highConfidenceFound === false) {
                        if (lowConfidenceCommittersDict[contributorEmail] !== undefined) {
                            var contributorDict1 = lowConfidenceCommittersDict[contributorEmail];

                            if (contributorDict1.issueAuthor.length > 0) {
                                var issueAuthorDict1 = contributorDict1.issueAuthor[0];
                                var strategyDict1 = issueAuthorDict1.XCSIssueSuspectstrategy;

                                if (strategyDict1.reliability < strategy.reliability) {
                                    lowConfidenceCommittersDict[contributorEmail] = {
                                        contributor: contributor,
                                        issueAuthor: [issueAuthor],
                                        email: contributorEmail
                                    };
                                }
                                else if (strategyDict1.reliability === strategy.reliability) {
                                    var issueAuthorArray1 = contributorDict1.issueAuthor;
                                    issueAuthorArray1.push(issueAuthor);

                                    lowConfidenceCommittersDict[contributorEmail] = {
                                        contributor: contributor,
                                        issueAuthor: issueAuthorArray1,
                                        email: contributorEmail
                                    };
                                }
                            }
                        }
                        else {
                            lowConfidenceCommittersDict[contributorEmail] = {
                                contributor: contributor,
                                issueAuthor: [issueAuthor],
                                email: contributorEmail
                            };
                        }
                    }
                }
            }

            for (var contributorDict2 in highConfidenceCommittersDict) {
                if (highConfidenceCommittersDict[contributorDict2]) {
                    highConfidenceCommittersArray.push(highConfidenceCommittersDict[contributorDict2]);
                }
            }

            for (var contributorDict3 in lowConfidenceCommittersDict) {
                if (lowConfidenceCommittersDict[contributorDict3]) {
                    lowConfidenceCommittersArray.push(lowConfidenceCommittersDict[contributorDict3]);
                }
            }

            var contributorString = "";
            if (highConfidenceCommittersArray.length > 0) {
                contributorString += introducedBy(issue, false);

                var contributorsStringArray = [];
                for (var d = 0; d < highConfidenceCommittersArray.length; d++) {
                    var contributorDict4 = highConfidenceCommittersArray[d];
                    var contributor4 = contributorDict4.contributor;
                    var issueAuthorArray4 = contributorDict4.issueAuthor;
                    var shasArray4 = [];

                    for (var i4 = 0; i4 < issueAuthorArray4.length; i4++) {
                        shasArray4.push(commitHash(issueAuthorArray4[i4].XCSCommitHash));
                    }
                    shasArray4 = _.uniq(shasArray4);

                    contributorsStringArray.push(renderContributor(contributor4)+" ("+stringifyArray(shasArray4)+")");
                }
                contributorString += stringifyArray(contributorsStringArray);
            }
            else if (lowConfidenceCommittersArray.length > 0) {
                contributorString += introducedBy(issue, true);

                var contributorsStringArray1 = [];
                for (var r = 0; r < lowConfidenceCommittersArray.length; r++) {
                    var contributorDict5 = lowConfidenceCommittersArray[r];
                    var contributor5 = contributorDict5.contributor;
                    var issueAuthorArray5 = contributorDict5.issueAuthor;
                    var shasArray5 = [];

                    for (var i5 = 0; i5 < issueAuthorArray5.length; i5++) {
                        shasArray5.push(commitHash(issueAuthorArray5[i5].XCSCommitHash));
                    }
                    shasArray5 = _.uniq(shasArray5);

                    contributorsStringArray1.push(renderContributor(contributor5));
                }
                contributorString += stringifyArray(contributorsStringArray1, "or");
            }
            if (contributorString !== "") {
                messageArray.push(contributorString);
            }
        }

        if (assignee) {
            let assigneeStr = assignee.username;
            if (assignee.fullName) {
                assigneeStr = `${assignee.fullName} (${assignee.username})`;
            }

            messageArray.push(`claimed by ${assigneeStr}`);
        }
    }

    if (messageArray.length > 0) {
        message = capitalize(stringifyArray(messageArray));
    }

    return new handlebars.SafeString(message);
}

function trackedByRadar(issue) {
    if (issue) {
        let radar = getAssociation(issue, 'radar');
        if (radar) {
            return 'Tracked by <rdar://problem/'+radar.problemID+'>';
        }
    }
    return '';
}

function numberOfIssues(issueTypes) {
    var templateResult = "";
    if (issueTypes !== undefined) {
        if (issueTypes.error !== undefined && issueTypes.error > 0) {
            templateResult += "<tr><td style='color: "+getColor("error")+"; white-space: nowrap;'>"+pluralize(issueTypes.error, "Error")+"</td></tr>";
        }
        if (issueTypes.warning !== undefined && issueTypes.warning > 0) {
            templateResult += "<tr><td colspan='2' style='color: "+getColor("warning")+"; white-space: nowrap;'>"+pluralize(issueTypes.warning, "Warning")+"</td></tr>";
        }
        if (issueTypes.analyzerWarning !== undefined && issueTypes.analyzerWarning > 0) {
            templateResult += "<tr><td style='color: "+getColor("analyzerWarning")+"; white-space: nowrap;'>"+pluralize(issueTypes.analyzerWarning, "Analysis Issue")+"</td></tr>";
        }
        if (issueTypes.testFailure !== undefined && issueTypes.testFailure > 0) {
            templateResult += "<tr><td style='color: "+getColor("testFailure")+"; white-space: nowrap;'>"+pluralize(issueTypes.testFailure, "Test Assertion")+"</td></tr>";
        }
        if (issueTypes.error !== undefined && issueTypes.error === 0 && issueTypes.warning !== undefined && issueTypes.warning === 0 && issueTypes.analyzerWarning !== undefined && issueTypes.analyzerWarning === 0 && issueTypes.testFailure !== undefined && issueTypes.testFailure === 0) {
            templateResult += "&nbsp;";
        }
    }
    else {
        templateResult += "&nbsp;&nbsp;";
    }
    return new handlebars.SafeString(templateResult);
}

function overrideToolchains(bot) {
    if (bot && bot.configuration && bot.configuration.overrideToolchain) {
        return new handlebars.SafeString('<span>Toolchain: ' + bot.configuration.overrideToolchain.displayName + ' (' + bot.configuration.overrideToolchain.identifier + ')</span><br>');
    }
    return "";
}

function integrationResultString(integration) {
    var templateResult = "";
    if (integration && integration.buildResultSummary) {
        if (integration.result === k.XCSIntegrationResultSucceeded) {
            templateResult += "Succeeded ";
        }
        else if (integration.result === k.XCSIntegrationResultCanceled) {
            templateResult += "Was Canceled ";
        }
        else if (integration.result === k.XCSIntegrationResultWarnings || integration.result === k.XCSIntegrationResultAnalyzerWarnings || integration.result === k.XCSIntegrationResultBuildErrors || integration.result === k.XCSIntegrationResultTestFailures){
            var buildResultSummary = integration.buildResultSummary;
            var issuesResultsArray = [];

            // Create issues type string
            if (buildResultSummary.errorCount > 0) {
                issuesResultsArray.push(pluralize(buildResultSummary.errorCount, "Error"));
            }
            if (buildResultSummary.testFailureCount > 0) {
                issuesResultsArray.push(pluralize(buildResultSummary.testFailureCount, "Test Failure"));
            }
            if (buildResultSummary.warningCount > 0) {
                issuesResultsArray.push(pluralize(buildResultSummary.warningCount, "Warning"));
            }
            if (buildResultSummary.analyzerWarningCount > 0) {
                issuesResultsArray.push(pluralize(buildResultSummary.analyzerWarningCount, "Analysis Issue"));
            }
			if (buildResultSummary.errorCount > 0 || buildResultSummary.testFailureCount > 0) {
	            templateResult += "Failed with "+ stringifyArray(issuesResultsArray);
			} else {
	            templateResult += "Completed with "+ stringifyArray(issuesResultsArray);
			}
        }
        else {
            templateResult += "Failed ";
        }
    }
    else {
        templateResult += "Failed ";
    }
    return templateResult;
}


function commitHash(commit_hash) {
    if (commit_hash !== undefined && commit_hash !== null && commit_hash.length >= 7) {
        var shortSha = "";
        for (var i = 0; i < 7; i++) {
            shortSha += commit_hash[i];
        }
        return shortSha;
    }
    else {
        return "";
    }
}

function reportRange(results) {
    var templateResult = "";
    if (results) {
        if (results.schedule === "daily" || results.schedule === "weekly") {

            var data = {};
            if (results.schedule === "daily") {
                data = {
                    fromDate: fullWordsDate(results.toDate),
                    toDate: "",
                    reportRangeTitle: "Report Date"
                };
            }
            else if (results.schedule === "weekly") {
                data = {
                    fromDate: fullWordsDate(results.sinceDate),
                    toDate: " - "+fullWordsDate(results.toDate),
                    reportRangeTitle: "Report Range"
                };
            }

            templateResult += templates.report_range(data);
        }
    }
    return new handlebars.SafeString(templateResult);
}

function isEqual(value1, value2) {
    return value1 === value2 ? true : false;
}

function configChangeRow(text) {
    return "<tr><td width=\"20\">&nbsp;</td><td>" + text + "</td></tr>";
}

function issueAuthorStrategyToString(issueAuthorStrategyInt, issueCount) {
    var strategyString = "";

    if (issueAuthorStrategyInt) {
        switch (issueAuthorStrategyInt) {
            case k.XCSIssueIdentificationStrategyBlameLineAgainstCommits:
                if (issueCount > 1) {
                    strategyString = "Your commit introduced an issue.";
                }
                else {
                    strategyString = "Your commit introduced this issue.";
                }
                break;
            case k.XCSIssueIdentificationStrategyFileHasBeenModifiedByCommits:
                if (issueCount > 1) {
                    strategyString = "A commit you made included changes to a file that contains an issue.";
                }
                else {
                    strategyString = "A commit you made included changes the file that contains an issue.";
                }
                break;
            case k.XCSIssueIdentificationStrategyBlameLine:
                if (issueCount > 1) {
                    strategyString = "You are the most recent committer to modify a line of code containing an issue.";
                }
                else {
                    strategyString = "You are the most recent committer to modify the line of code containing the issue.";
                }
                break;
            case k.XCSIssueIdentificationStrategyLastCommitFromFile:
                if (issueCount > 1) {
                    strategyString = "You are the last committer to have modified a file containing an issue.";
                }
                else {
                    strategyString = "You are the last committer to have modified the file containing the issue.";
                }
                break;
            case k.XCSIssueIdentificationStrategyMostCommitterInFile:
                if (issueCount > 1) {
                    strategyString = "You are a committer who has made the most number of modifications to a file containing an issue.";
                }
                else {
                    strategyString = "You are a committer who has made the most number of modifications to the file containing the issue.";
                }
                break;
            case k.XCSIssueIdentificationStrategySingleCommitInIntegration:
                strategyString = "You were the only committer in this integration.";
                break;
            case k.XCSIssueIdentificationStrategyMultipleCommitsSingleUserInIntegration:
                strategyString = "You were the only committer in this integration.";
                break;
            default:
                break;
        }

    }
    return strategyString;
}

function links(integration, hostname, trigger) {
    var templateResult = "";
    
    if (integration) {
        templateResult += "<a href='xcbot://"+hostname+"/botID/"+integration.bot._id+"/integrationID/"+integration._id+"'>Open in Xcode</a>";
        if (trigger !== undefined) {
            var emailConfiguration = trigger.emailConfiguration;
            if (emailConfiguration.includeLogs) {
                templateResult += " | <a href='https://"+hostname+"/xcode/internal/api/integrations/"+integration._id+"/download_logs'>Download Integration Logs</a>";
            }
        }
        else {
            templateResult += " | <a href='https://"+hostname+"/xcode/internal/api/integrations/"+integration._id+"/download_logs'>Download Integration Logs</a>";
        }
    }
    
    return new handlebars.SafeString(templateResult);
}

var templates = {
    report_range: require('./partials/_report_range.hbs')
};

function loadHelperTemplates(handlebars) {
    handlebars.registerHelper('issue_file_path_introduction', issue_file_path_introduction);
    handlebars.registerHelper('issue_type_introduction', issue_type_introduction);
    handlebars.registerHelper('issue_message', issue_message);
    handlebars.registerHelper('format_date', formatDate);
    handlebars.registerHelper('fullwords_date', fullWordsDate);
    handlebars.registerHelper('commit_message', commit_message);
    handlebars.registerHelper('render_contributor', renderContributor);
    handlebars.registerHelper('stringify_array', stringifyArray);
    handlebars.registerHelper('issue_introduced_by', issueIntroducedBy);
    handlebars.registerHelper('tracked_by_radar', trackedByRadar);
    handlebars.registerHelper('number_of_issues', numberOfIssues);
    handlebars.registerHelper('override_toolchain', overrideToolchains);
    handlebars.registerHelper('commit_hash', commitHash);
    handlebars.registerHelper('report_range', reportRange);
    handlebars.registerHelper('links', links);
    handlebars.registerHelper('isEqual', isEqual);
}

function notification_helper() {}
module.exports = notification_helper;

notification_helper.pluralize = pluralize;
notification_helper.humanize = humanize;
notification_helper.htmlEscape = htmlEscape;
notification_helper.filePathMessage = filePathMessage;
notification_helper.issueMessage = issueMessage;
notification_helper.renderContributor = renderContributor;
notification_helper.formatDate = formatDate;
notification_helper.fullWordsDate = fullWordsDate;
notification_helper.loadHelperTemplates = loadHelperTemplates;
notification_helper.getColor = getColor;
notification_helper.trimString = trimString;
notification_helper.stringifyArray = stringifyArray;
notification_helper.trackedByRadar = trackedByRadar;
notification_helper.numberOfIssues = numberOfIssues;
notification_helper.integrationResultString = integrationResultString;
notification_helper.commitHash = commitHash;
notification_helper.configChangeRow = configChangeRow;
notification_helper.commaSeperatedArrayToString = commaSeperatedArrayToString;
notification_helper.issueAuthorStrategyToString = issueAuthorStrategyToString;
notification_helper.links = links;
notification_helper.issue_type_dispay_name = issue_type_dispay_name;
