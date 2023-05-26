'use strict';

var handlebars = require('handlebars'),
    k = require('../constants.js'),
    notification_helper = require('./notification_helper.js');

handlebars.registerPartial('version_info', require('./partials/_email_version.hbs'));
handlebars.registerPartial('bot_configuration', require('./partials/_bot_configuration.hbs'));
handlebars.registerPartial('new_issue_commit_messages', require('./newIssueNotification/_commit_messages.hbs'));
handlebars.registerPartial('new_issue_issue_details', require('./newIssueNotification/_issue_details.hbs'));
handlebars.registerPartial('resolved_issue_issue_details', require('./newIssueNotification/_resolved_issue_details.hbs'));
handlebars.registerPartial('no_new_issue_issue_details', require('./newIssueNotification/_no_issue_details.hbs'));
handlebars.registerPartial('no_new_issue_commit_messages', require('./newIssueNotification/_no_commit_messages.hbs'));

var templates = {
    new_issue_list: require('./partials/_new_issue.hbs'),
    html: require('./newIssueNotification/email_html.hbs'),
    new_issue_commit: require('./partials/_new_issue_commit.hbs')
};

handlebars.registerHelper('new_issues_issues_list', function (issueAuthor, commitsByHash, issuesType) {
    var templateResult = "";
    
    var issueIdsArray =  issueAuthor[issuesType].issueIdsWithHighStrategy.concat(issueAuthor[issuesType].issueIdsWithLowStrategy);
    for (var i = 0; i < issueIdsArray.length; i++) {
        var issueId = issueIdsArray[i];
        var issue = issueAuthor[issuesType].issues[issueId];
        
        templateResult += templates.new_issue_list({
            issue: issue.issue, 
            commitsByHash: commitsByHash
        });
    }
    
    return new handlebars.SafeString(templateResult);
});

handlebars.registerHelper('new_issues_commits_list', function (commitsByRepositoryArray, commitsByHash) {
    var templateResult = "";
    
    if (commitsByRepositoryArray && commitsByHash) {
        for (var j = 0; j < commitsByRepositoryArray.length; j++) {
            var commitsForRepo = commitsByRepositoryArray[j];
            var hydratedCommitsArray = [];
            for (var i = 0; i < commitsForRepo.commits.length; i++) {
                var commitObj = commitsForRepo.commits[i];
                if (commitsByHash[commitObj.commitHash] !== undefined) {
                    var data = {
                        commit: commitsByHash[commitObj.commitHash],
                        issueTypes: commitObj.issueTypes
                    };
                    hydratedCommitsArray.push(data);
                }
            }
            var data1 = {
                repository: commitsForRepo.repository,
                branch: commitsForRepo.branch,
                commits: hydratedCommitsArray
            };
            templateResult += templates.new_issue_commit(data1);
        }
    }
    return new handlebars.SafeString(templateResult);
});

function getIssueTypesProjectNamesAndCommitShasFromIssues(issues, issueIds, projectNames, issueTypes, commitShas, highestStrategyFound) {
    for (var i = 0; i < issueIds.length; i++) {
        var issueId = issueIds[i];
        var issue = issues[issueId];

        if (issue.issue.type === "analyzerWarning") {
            issueTypes.analyzerWarning += 1;
        }
        else if (issue.issue.type === "warning") {
            issueTypes.warning += 1;
        }
        else if (issue.issue.type === "error") {
            issueTypes.error += 1;
        }
        else if (issue.issue.type === "testFailure") {
            issueTypes.testFailure += 1;
        }

        var authorStrategies = issue.authorStrategy;
        for (var j = 0; j < authorStrategies.length; j++) {
            var authorStrategy = authorStrategies[j];
            
            if (highestStrategyFound) {
                if ( (authorStrategy.confidence < highestStrategyFound.confidence) || (authorStrategy.confidence === highestStrategyFound.confidence && authorStrategy.reliability > highestStrategyFound.reliability) ) {
                    highestStrategyFound.identificationStrategy = authorStrategy.identificationStrategy;
                    highestStrategyFound.reliability = authorStrategy.reliability;
                    highestStrategyFound.confidence = authorStrategy.confidence;
                }
            }
            
            if (projectNames.indexOf(authorStrategy.projectName) === -1) {
                projectNames.push(authorStrategy.projectName);
            }
            
            var commitSha = authorStrategy.commit.XCSCommitHash.substring(0, 7);
            if (commitShas.indexOf(commitSha) === -1) {
                commitShas.push(commitSha);
            }
        }
    }
}

function processIssueTypes(issuesData, issueAuthor, issueType) {
    getIssueTypesProjectNamesAndCommitShasFromIssues(issueAuthor[issueType].issues, issueAuthor[issueType].issueIdsWithHighStrategy, issuesData.highProjectNames, issuesData.issueTypes, issuesData.highCommitShas);
    getIssueTypesProjectNamesAndCommitShasFromIssues(issueAuthor[issueType].issues, issueAuthor[issueType].issueIdsWithLowStrategy, issuesData.lowProjectNames, issuesData.issueTypes, issuesData.lowCommitShas, issuesData.highestStrategyFound);
    
    if (issuesData.issueTypes.error > 0) {
        issuesData.issueTypesCount += 1;
    }
    if (issuesData.issueTypes.warning > 0) {
        issuesData.issueTypesCount += 1;
    }
    if (issuesData.issueTypes.analyzerWarning > 0) {
        issuesData.issueTypesCount += 1;
    }
    if (issuesData.issueTypes.testFailure > 0) {
        issuesData.issueTypesCount += 1;
    }

    // Create issues type string
    if (issuesData.issueTypes.error > 0) {
        issuesData.issuesTypeString += notification_helper.pluralize(issuesData.issueTypes.error, "error");
    }
    
    if (issuesData.issueTypes.error > 0 && issuesData.issueTypesCount === 2) {
        issuesData.issuesTypeString += " and ";
        issuesData.issueTypesCount -= 1;
    }
    else if (issuesData.issueTypes.error > 0 && issuesData.issueTypesCount > 2) {
        issuesData.issuesTypeString += ", ";
        issuesData.issueTypesCount -= 1;
    }
    
    if (issuesData.issueTypes.testFailure > 0) {
        issuesData.issuesTypeString += notification_helper.pluralize(issuesData.issueTypes.testFailure, "test assertion");
    }
    
    if (issuesData.issueTypes.testFailure > 0 && issuesData.issueTypesCount === 2) {
        issuesData.issuesTypeString += " and ";
        issuesData.issueTypesCount -= 1;
    }
    else if (issuesData.issueTypes.testFailure > 0 && issuesData.issueTypesCount > 2) {
        issuesData.issuesTypeString += ", ";
        issuesData.issueTypesCount -= 1;
    }
    
    if (issuesData.issueTypes.warning > 0) {
        issuesData.issuesTypeString += notification_helper.pluralize(issuesData.issueTypes.warning, "warning");
    }
    
    if (issuesData.issueTypes.warning > 0 && issuesData.issueTypesCount === 2) {
        issuesData.issuesTypeString += " and ";
    }
    
    if (issuesData.issueTypes.analyzerWarning > 0) {
        issuesData.issuesTypeString += notification_helper.pluralize(issuesData.issueTypes.analyzerWarning, "analysis issue");
    }

    if (issueAuthor[issueType].issueIdsWithHighStrategy.length > 1) {
        issuesData.hasMoreThanOneHighIssue = true;
    }
    if (issueAuthor[issueType].issueIdsWithLowStrategy.length > 1) {
        issuesData.hasMoreThanOneLowIssue = true;
    }
}

// Create personalized sentence at the top of new issues emails
handlebars.registerHelper('issue_summary', function(integration, issueAuthor, hostname, trigger) {
    let templateResult = "";
    
    let date = notification_helper.fullWordsDate(integration.startedTime);
    let hasFreshIssues = false;
    let hasResolvedIssues = false;
    let emailConfiguration = trigger.emailConfiguration;

    if (issueAuthor.freshIssues !== null && issueAuthor.freshIssues !== undefined && Object.keys(issueAuthor.freshIssues.issues).length > 0) {
        hasFreshIssues = true;
    }
    if (issueAuthor.resolvedIssues !== null && issueAuthor.resolvedIssues !== undefined && Object.keys(issueAuthor.resolvedIssues.issues).length > 0) {
        hasResolvedIssues = true;
    }

    if (hasFreshIssues) {
        let freshIssuesData = {
            issueTypes: {
                "analyzerWarning": 0,
                "warning": 0,
                "error": 0,
                "testFailure": 0
            },
            issueTypesCount: 0,
            issuesTypeString: "",
            highProjectNames: [],
            highCommitShas: [],
            lowProjectNames: [],
            lowCommitShas: [],
            highestStrategyFound: {
                identificationStrategy: "",
                reliability: 0,
                confidence: 100
            },
            hasMoreThanOneHighIssue: false,
            hasMoreThanOneLowIssue: false
        };
        processIssueTypes(freshIssuesData, issueAuthor, "freshIssues");
        let freshIssues = issueAuthor.freshIssues;

        templateResult += "Integration #"+integration.number+" ran on "+date+" on "+hostname+" and detected "+freshIssuesData.issuesTypeString+" on \""+integration.bot.name+"\".";
        
        // Only high confidence strategies
        if (freshIssues.issueIdsWithHighStrategy.length > 0 && freshIssues.issueIdsWithLowStrategy.length === 0) {
            templateResult += " "+(freshIssuesData.hasMoreThanOneHighIssue?"These":"This")+" "+notification_helper.pluralize(freshIssues.issueIdsWithHighStrategy.length, "issue", false)+" "+(freshIssuesData.hasMoreThanOneHighIssue?"were":"was")+" introduced by "+notification_helper.pluralize(freshIssuesData.highCommitShas.length, "commit")+" you made to the "+notification_helper.stringifyArray(freshIssuesData.highProjectNames)+" "+notification_helper.pluralize(freshIssuesData.highProjectNames.length, "repository", false)+" ("+notification_helper.stringifyArray(freshIssuesData.highCommitShas)+").";
        }
        // Mix of high and low confidence strategies
        else if (freshIssues.issueIdsWithHighStrategy.length > 0 && freshIssues.issueIdsWithLowStrategy.length > 0) {
            templateResult += " "+freshIssues.issueIdsWithHighStrategy.length+" of "+(freshIssuesData.hasMoreThanOneHighIssue?"these":"this")+" "+notification_helper.pluralize(freshIssues.issueIdsWithHighStrategy.length, "issue", false)+" "+(freshIssuesData.hasMoreThanOneHighIssue?"were":"was")+" introduced by "+notification_helper.pluralize(freshIssuesData.highCommitShas.length, "commit")+" you made to the "+notification_helper.stringifyArray(freshIssuesData.highProjectNames)+" "+notification_helper.pluralize(freshIssuesData.highProjectNames.length, "repository", false)+" ("+notification_helper.stringifyArray(freshIssuesData.highCommitShas)+").";
            
            templateResult += " You might also be able to help solve "+(freshIssuesData.hasMoreThanOneLowIssue?"these":"an")+" "+notification_helper.pluralize(freshIssues.issueIdsWithLowStrategy.length, "issue", false)+" which "+(freshIssuesData.hasMoreThanOneLowIssue?"were":"was")+" introduced to the "+notification_helper.stringifyArray(freshIssuesData.lowProjectNames)+" "+notification_helper.pluralize(freshIssuesData.lowProjectNames.length, "repository", false)+". "+notification_helper.issueAuthorStrategyToString(freshIssuesData.highestStrategyFound.identificationStrategy, freshIssues.issueIdsWithLowStrategy.length);
        }
        // Only low confidence strategies
        else if (freshIssues.issueIdsWithHighStrategy.length === 0 && freshIssues.issueIdsWithLowStrategy.length > 0) { 
            templateResult += " You might be able to help solve "+(freshIssuesData.hasMoreThanOneLowIssue?"these":"this")+" "+notification_helper.pluralize(freshIssues.issueIdsWithLowStrategy.length, "issue", false)+" which "+(freshIssuesData.hasMoreThanOneLowIssue?"were":"was")+" introduced to the "+notification_helper.stringifyArray(freshIssuesData.lowProjectNames)+" "+notification_helper.pluralize(freshIssuesData.lowProjectNames.length, "repository", false)+". "+notification_helper.issueAuthorStrategyToString(freshIssuesData.highestStrategyFound.identificationStrategy, freshIssues.issueIdsWithLowStrategy.length);
        }
    }

    if (hasResolvedIssues) {
        let resolvedIssuesData = {
            issueTypes: {
                "analyzerWarning": 0,
                "warning": 0,
                "error": 0,
                "testFailure": 0
            },
            issueTypesCount: 0,
            issuesTypeString: "",
            highProjectNames: [],
            highCommitShas: [],
            lowProjectNames: [],
            lowCommitShas: [],
            highestStrategyFound: {
                identificationStrategy: "",
                reliability: 0,
                confidence: 100
            },
            hasMoreThanOneHighIssue: false,
            hasMoreThanOneLowIssue: false
        };
        processIssueTypes(resolvedIssuesData, issueAuthor, "resolvedIssues");

        if (!hasFreshIssues) {
            templateResult += "Integration #"+integration.number+" ran on "+date+" on "+hostname+" and resolved "+resolvedIssuesData.issuesTypeString+" on \""+integration.bot.name+"\".";
        }
        else {
            templateResult += "<br>"+resolvedIssuesData.issuesTypeString+(resolvedIssuesData.issueTypesCount===1?" has":" have")+" been resolved.";
        }
    }

    let includeResolvedIssues = false;
    if (emailConfiguration.includeResolvedIssues !== undefined) {
        includeResolvedIssues = emailConfiguration.includeResolvedIssues;
    }

    templateResult += "<br> This bot is configured to notify committers when they introduce "+(includeResolvedIssues?"and resolve ":"")+"new issues.";
    
    return new handlebars.SafeString(templateResult);
});

handlebars.registerHelper('resolution_summary', function(integration, issueAuthor) {
    let templateResult = "";

    if (issueAuthor.freshIssues !== null && issueAuthor.freshIssues !== undefined && Object.keys(issueAuthor.freshIssues.issues).length > 0) {
        let botConfiguration = integration.bot.configuration;
        let freshIssues = issueAuthor.freshIssues;
        let issueCount = freshIssues.issueIdsWithHighStrategy.length + freshIssues.issueIdsWithLowStrategy.length;
        
        if (botConfiguration.scheduleType === k.XCSBotScheduleTypeManual) {
            templateResult += "After fixing "+(issueCount > 1?"these issues":"this issue")+", you should trigger a manual integration as this bot is not configured to run on a schedule.";
        }
        else if (botConfiguration.scheduleType === k.XCSBotScheduleTypeOnCommit) {
            templateResult += "After fixing "+(issueCount > 1?"these issues":"this issue")+", your changes will be automatically built as this bot is configured to run on commit.";
        }
        else if (botConfiguration.scheduleType === k.XCSBotScheduleTypePeriodic && botConfiguration.periodicScheduleInterval !== k.XCSBotPeriodicScheduleIntervalNone && botConfiguration.periodicScheduleInterval !== k.XCSBotPeriodicScheduleIntervalIntegration) {
            
            let dateString = "";
            let hour = "";
            let isPM = false;
            
            // Compute hour of integration.
            if (botConfiguration.hourOfIntegration > 11) {
                isPM = true;
            }
            if (botConfiguration.hourOfIntegration > 12) {
                hour = botConfiguration.hourOfIntegration-12;
            }
            if (hour === "") {
                hour = botConfiguration.hourOfIntegration;
            }

            let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            let day = days[botConfiguration.weeklyScheduleDay];
            
            if (botConfiguration.periodicScheduleInterval === k.XCSBotPeriodicScheduleIntervalHourly) {
                dateString += "every hour";
            }
            else if (botConfiguration.periodicScheduleInterval === k.XCSBotPeriodicScheduleIntervalDaily) {
                dateString += "daily at "+hour+(isPM? "PM":"AM");
            }
            else if (botConfiguration.periodicScheduleInterval === k.XCSBotPeriodicScheduleIntervalWeekly) {
                dateString += "weekly on "+day+" at "+hour+(isPM? "PM":"AM");
            }
            
            templateResult += "After fixing "+(issueCount > 1?"these issues":"this issue")+", your changes will be automatically built because this bot is configured to run "+dateString+".  To clear "+(issueCount > 1?"these issues":"this issue")+" sooner, you should trigger a manual integration.";
        }
    }
    
    return new handlebars.SafeString(templateResult);
});

notification_helper.loadHelperTemplates(handlebars);

exports.html = function (info) {
    return templates.html(info);
};