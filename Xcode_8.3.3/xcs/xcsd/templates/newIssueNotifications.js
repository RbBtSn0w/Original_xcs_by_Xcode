'use strict';

var handlebars = require('handlebars'),
    k = require('../constants.js'),
    notification_helper = require('./notification_helper.js');

handlebars.registerPartial('version_info', require('./partials/_email_version.hbs'));
handlebars.registerPartial('bot_configuration', require('./partials/_bot_configuration.hbs'));
handlebars.registerPartial('new_issue_commit_messages', require('./newIssueNotification/_commit_messages.hbs'));
handlebars.registerPartial('new_issue_issue_details', require('./newIssueNotification/_issue_details.hbs'));
handlebars.registerPartial('no_new_issue_issue_details', require('./newIssueNotification/_no_issue_details.hbs'));
handlebars.registerPartial('no_new_issue_commit_messages', require('./newIssueNotification/_no_commit_messages.hbs'));

var templates = {
    new_issue_list: require('./partials/_new_issue.hbs'),
    html: require('./newIssueNotification/email_html.hbs'),
    new_issue_commit: require('./partials/_new_issue_commit.hbs')
};

handlebars.registerHelper('new_issues_issues_list', function (issueAuthor, commitsByHash) {
    var templateResult = "";
    
    var issueIdsArray =  issueAuthor.issueIdsWithHighStrategy.concat(issueAuthor.issueIdsWithLowStrategy);
    for (var i = 0; i < issueIdsArray.length; i++) {
        var issueId = issueIdsArray[i];
        var issue = issueAuthor.issues[issueId];
        
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

// Create personalized sentence at the top of new issues emails
handlebars.registerHelper('issue_summary', function(integration, issueAuthor, hostname) {
    var templateResult = "";
    
    var date = notification_helper.fullWordsDate(integration.startedTime);
    var issueTypes = {
        "analyzerWarning": 0,
        "warning": 0,
        "error": 0,
        "testFailure": 0
    };
    var issueTypesCount = 0;
    var issuesTypeString = "";
    var highProjectNames = [];
    var highCommitShas = [];
    var lowProjectNames = [];
    var lowCommitShas = [];
    var highestStrategyFound = {
        identificationStrategy: "",
        reliability: 0,
        confidence: 100
    };
    
    getIssueTypesProjectNamesAndCommitShasFromIssues(issueAuthor.issues, issueAuthor.issueIdsWithHighStrategy, highProjectNames, issueTypes, highCommitShas);
    getIssueTypesProjectNamesAndCommitShasFromIssues(issueAuthor.issues, issueAuthor.issueIdsWithLowStrategy, lowProjectNames, issueTypes, lowCommitShas, highestStrategyFound);
    
    if (issueTypes.error > 0) {
        issueTypesCount += 1;
    }
    if (issueTypes.warning > 0) {
        issueTypesCount += 1;
    }
    if (issueTypes.analyzerWarning > 0) {
        issueTypesCount += 1;
    }
    if (issueTypes.testFailure > 0) {
        issueTypesCount += 1;
    }

    // Create issues type string
    if (issueTypes.error > 0) {
        issuesTypeString += notification_helper.pluralize(issueTypes.error, "error");
    }
    
    if (issueTypes.error > 0 && issueTypesCount === 2) {
        issuesTypeString += " and ";
        issueTypesCount -= 1;
    }
    else if (issueTypes.error > 0 && issueTypesCount > 2) {
        issuesTypeString += ", ";
        issueTypesCount -= 1;
    }
    
    if (issueTypes.testFailure > 0) {
        issuesTypeString += notification_helper.pluralize(issueTypes.testFailure, "test assertion");
    }
    
    if (issueTypes.testFailure > 0 && issueTypesCount === 2) {
        issuesTypeString += " and ";
        issueTypesCount -= 1;
    }
    else if (issueTypes.testFailure > 0 && issueTypesCount > 2) {
        issuesTypeString += ", ";
        issueTypesCount -= 1;
    }
    
    if (issueTypes.warning > 0) {
        issuesTypeString += notification_helper.pluralize(issueTypes.warning, "warning");
    }
    
    if (issueTypes.warning > 0 && issueTypesCount === 2) {
        issuesTypeString += " and ";
    }
    
    if (issueTypes.analyzerWarning > 0) {
        issuesTypeString += notification_helper.pluralize(issueTypes.analyzerWarning, "analysis issue");
    }
    
    var hasMoreThanOneHighIssue = false;
    var hasMoreThanOneLowIssue = false;
    if (issueAuthor.issueIdsWithHighStrategy.length > 1) {
        hasMoreThanOneHighIssue = true;
    }
    if (issueAuthor.issueIdsWithLowStrategy.length > 1) {
        hasMoreThanOneLowIssue = true;
    }

    templateResult += "Integration #"+integration.number+" ran on "+date+" on "+hostname+" and detected "+issuesTypeString+" on \""+integration.bot.name+"\".";
    
    // Only high confidence strategies
    if (issueAuthor.issueIdsWithHighStrategy.length > 0 && issueAuthor.issueIdsWithLowStrategy.length === 0) {
        templateResult += " "+(hasMoreThanOneHighIssue?"These":"This")+" "+notification_helper.pluralize(issueAuthor.issueIdsWithHighStrategy.length, "issue", false)+" "+(hasMoreThanOneHighIssue?"were":"was")+" introduced by "+notification_helper.pluralize(highCommitShas.length, "commit")+" you made to the "+notification_helper.stringifyArray(highProjectNames)+" "+notification_helper.pluralize(highProjectNames.length, "repository", false)+" ("+notification_helper.stringifyArray(highCommitShas)+").";
    }
    // Mix of high and low confidence strategies
    else if (issueAuthor.issueIdsWithHighStrategy.length > 0 && issueAuthor.issueIdsWithLowStrategy.length > 0) {
        templateResult += " "+issueAuthor.issueIdsWithHighStrategy.length+" of "+(hasMoreThanOneHighIssue?"these":"this")+" "+notification_helper.pluralize(issueAuthor.issueIdsWithHighStrategy.length, "issue", false)+" "+(hasMoreThanOneHighIssue?"were":"was")+" introduced by "+notification_helper.pluralize(highCommitShas.length, "commit")+" you made to the "+notification_helper.stringifyArray(highProjectNames)+" "+notification_helper.pluralize(highProjectNames.length, "repository", false)+" ("+notification_helper.stringifyArray(highCommitShas)+").";
        
        templateResult += " You might also be able to help solve "+(hasMoreThanOneLowIssue?"these":"an")+" "+notification_helper.pluralize(issueAuthor.issueIdsWithLowStrategy.length, "issue", false)+" which "+(hasMoreThanOneLowIssue?"were":"was")+" introduced to the "+notification_helper.stringifyArray(lowProjectNames)+" "+notification_helper.pluralize(lowProjectNames.length, "repository", false)+". "+notification_helper.issueAuthorStrategyToString(highestStrategyFound.identificationStrategy, issueAuthor.issueIdsWithLowStrategy.length);
    }
    // Only low confidence strategies
    else if (issueAuthor.issueIdsWithHighStrategy.length === 0 && issueAuthor.issueIdsWithLowStrategy.length > 0) { 
        templateResult += " You might be able to help solve "+(hasMoreThanOneLowIssue?"these":"this")+" "+notification_helper.pluralize(issueAuthor.issueIdsWithLowStrategy.length, "issue", false)+" which "+(hasMoreThanOneLowIssue?"were":"was")+" introduced to the "+notification_helper.stringifyArray(lowProjectNames)+" "+notification_helper.pluralize(lowProjectNames.length, "repository", false)+". "+notification_helper.issueAuthorStrategyToString(highestStrategyFound.identificationStrategy, issueAuthor.issueIdsWithLowStrategy.length);
    }
    templateResult += " This bot is configured to notify committers when they introduce new issues.";
    
    return new handlebars.SafeString(templateResult);
});

handlebars.registerHelper('resolution_summary', function(integration, issueAuthor) {
    var templateResult = "";

    var botConfiguration = integration.bot.configuration;
    var issueCount = issueAuthor.issueIdsWithHighStrategy.length + issueAuthor.issueIdsWithLowStrategy.length;
    
    if (botConfiguration.scheduleType === k.XCSBotScheduleTypeManual) {
        templateResult += "After fixing "+(issueCount > 1?"these issues":"this issue")+", you should trigger a manual integration as this bot is not configured to run on a schedule.";
    }
    else if (botConfiguration.scheduleType === k.XCSBotScheduleTypeOnCommit) {
        templateResult += "After fixing "+(issueCount > 1?"these issues":"this issue")+", your changes will be automatically built as this bot is configured to run on commit.";
    }
    else if (botConfiguration.scheduleType === k.XCSBotScheduleTypePeriodic && botConfiguration.periodicScheduleInterval !== k.XCSBotPeriodicScheduleIntervalNone && botConfiguration.periodicScheduleInterval !== k.XCSBotPeriodicScheduleIntervalIntegration) {
        
        var dateString = "";
        var hour = "";
        var isPM = false;
        
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

        var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var day = days[botConfiguration.weeklyScheduleDay];
        
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
    
    return new handlebars.SafeString(templateResult);
});

notification_helper.loadHelperTemplates(handlebars);

exports.html = function (info) {
    return templates.html(info);
};