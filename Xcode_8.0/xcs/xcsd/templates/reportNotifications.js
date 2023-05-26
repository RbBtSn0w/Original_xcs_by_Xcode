'use strict';

var handlebars = require('handlebars'),
    notification_helper = require('./notification_helper.js'),
    core = require('../util/bridge/core.js');

handlebars.registerPartial('version_info', require('./partials/_email_version.hbs'));
handlebars.registerPartial('bot_configuration', require('./partials/_bot_configuration.hbs'));
handlebars.registerPartial('report_commit_messages', require('./reportNotification/_commit_messages.hbs'));
handlebars.registerPartial('no_report_commit_messages', require('./reportNotification/_no_commit_messages.hbs'));
handlebars.registerPartial('report_issue_details', require('./reportNotification/_issue_details.hbs'));
handlebars.registerPartial('no_report_issue_details', require('./reportNotification/_no_issue_details.hbs'));

var templates = {
    new_issue_list: require('./partials/_new_issue.hbs'),
    new_issue_commit: require('./partials/_new_issue_commit.hbs'),
    html: require('./reportNotification/email_html.hbs')
};

handlebars.registerHelper('report_summary', function(results) {
    var templateResult = "";

    var bot = results.bot;
    var schedule = results.schedule;
    var integrationsCount = results.integrationsCount;
    var integrationResults = results.integrationResults;
    var testsDelta = results.testsDelta;
    var testsFailureDelta = results.testsFailureDelta;
    var maximumNumberOfTests  = results.maximumNumberOfTests;
    var perfTestsRegressionDelta = results.perfTestsRegressionDelta;
    var commitsCount = results.commitsCount;
    var codeCoveragePercentageDelta = results.codeCoveragePercentageDelta;
    var successStreak = results.successStreak;
    var integration = null;
    var committersCount = results.committersCount;
    var lastIntegration = results.lastIntegration;

    if (schedule === "integration" && results.integration !== undefined) {
        integration = results.integration;
    }

    if (schedule === "daily" || schedule === "weekly") {
        templateResult += "Over the last ";

        if (schedule === "daily") {
            templateResult += "day, ";
        }
        else if (schedule === "weekly") {
            templateResult += "week, ";
        }

        templateResult += " integrations of \""+bot.name+"\" ";

        if (integrationResults.succeeded > 0 && integrationResults.failed === 0) {
            templateResult += "have been passing, ";
        }
        else if (integrationResults.succeeded === 0 && integrationResults.failed > 0) {
            templateResult += "have been failing, ";
        }
        else if (integrationResults.succeeded > 0 && integrationResults.failed > 0){
            var totalRuns = integrationResults.succeeded + integrationResults.failed;
            templateResult += "have failed "+integrationResults.failed+" times ("+(Math.round(integrationResults.failed/totalRuns*100*10)/10)+"% success rate), ";
        }

        templateResult += "and there has been a total of "+notification_helper.pluralize(integrationsCount, "integration")+" during this period. ";
    }


    if ((lastIntegration && lastIntegration.buildResultSummary && lastIntegration.buildResultSummary.testsCount > 0) || (integration && integration.buildResultSummary && integration.buildResultSummary.testsCount > 0)) {
        var buildResultSummary;
        if (lastIntegration) {
            buildResultSummary = lastIntegration.buildResultSummary;
        }
        else if (integration) {
            buildResultSummary = integration.buildResultSummary;
        }

        var passFailTestCount = 0;
        if (buildResultSummary.testFailureCount > 0) {
            passFailTestCount = buildResultSummary.testFailureCount;
        }
        else {
            passFailTestCount = buildResultSummary.testsCount;
        }

        templateResult += "The total number of "+(buildResultSummary.testFailureCount > 0?"failing":"passing")+" tests ";
        if (schedule === "daily" || schedule === "weekly") {
            templateResult += "when this report was sent ";
        }
        else if (schedule === "integration") {
            templateResult += "in this integration ";
        }
        templateResult += "was "+passFailTestCount;

        if (testsFailureDelta !== 0) {
            if (testsFailureDelta > 0) {
                templateResult += " (an increase of "+testsFailureDelta+" for this time period)";
            }
            else if (testsFailureDelta < 0) {
                templateResult += " (a decrease of "+Math.abs(testsFailureDelta)+" for this time period)";
            }
        }

        if (buildResultSummary.testFailureCount !== 0) {
            templateResult += ", where the total number of tests was "+buildResultSummary.testsCount;
            if (testsDelta !== 0) {
                if (testsDelta > 0) {
                    templateResult += " (an increase of "+notification_helper.pluralize(testsDelta, "test")+"). ";
                }
                else if (testsDelta < 0) {
                    templateResult += " (a decrease of "+notification_helper.pluralize(Math.abs(testsDelta), "test")+"). ";
                }
            }
            else {
                templateResult += ". ";
            }
        }
        else {
            templateResult += ". ";
        }

        if (perfTestsRegressionDelta !== 0) {
            if (perfTestsRegressionDelta > 0) {
                templateResult += notification_helper.pluralize(perfTestsRegressionDelta, "performance test")+" "+(Math.abs(perfTestsRegressionDelta)>1?"have":"has")+" regressed. ";
            }
            else if (perfTestsRegressionDelta < 0) {
                templateResult += notification_helper.pluralize(Math.abs(perfTestsRegressionDelta), "performance test")+" "+(Math.abs(perfTestsRegressionDelta)>1?"have":"has")+" improved. ";
            }
        }

        if (maximumNumberOfTests > buildResultSummary.testsCount) {
            templateResult += "The maximum number of tests found over this period was "+maximumNumberOfTests+". ";
        }
    }
    else {
        templateResult += "No tests were found ";
        if (schedule === "daily" || schedule === "weekly") {
            templateResult += "when this report was sent";
        }
        else if (schedule === "integration") {
            templateResult += "in this integration";
        }

        if (testsDelta < 0) {
            templateResult += " (a decrease of "+notification_helper.pluralize(Math.abs(testsDelta), "test")+"). ";
        }
        else {
            templateResult += ". ";
        }

        if (maximumNumberOfTests > 0) {
            templateResult += "The maximum number of tests found over this period was "+maximumNumberOfTests+". ";
        }
    }

    if (commitsCount > 0) {
        templateResult += "There "+(commitsCount>1?"were":"was")+" "+commitsCount+" "+notification_helper.pluralize(commitsCount, "commit", false);
        if (committersCount > 1) {
            templateResult += " from "+notification_helper.pluralize(committersCount, "unique committer");
        }

        if (codeCoveragePercentageDelta > 0) {
            templateResult += ", and the total code coverage improved by "+codeCoveragePercentageDelta+"%. ";
        }
        else if (codeCoveragePercentageDelta < 0) {
            templateResult += ", and the total code coverage regressed by "+codeCoveragePercentageDelta+"%. ";
        }
        else {
            templateResult += ". ";
        }
    }

    if (successStreak.streakCount > 0) {
        var integrationNumber = successStreak.integrationNumber;
        var startStreak = integrationNumber - successStreak.streakCount +1;
        templateResult += "The highest number of consecutive successful integrations was "+successStreak.streakCount+", occuring between integrations #"+startStreak+" and #"+integrationNumber+". ";
    }

    return new handlebars.SafeString(templateResult);
});

handlebars.registerHelper('configuration_changes_summary', function (changes) {
    const row = notification_helper.configChangeRow;
    const escape = notification_helper.htmlEscape;

    let templateResult = "";

    let descriptions = core.changesDescriptions(changes);
    if (descriptions) {
        descriptions.forEach(line => {
            templateResult += row(escape(line));
        });
    }

    return new handlebars.SafeString(templateResult);
});

function formatConfiguration(config) {
    if (config) {
        return `"${notification_helper.htmlEscape(config)}"`;
    } else {
        return "scheme setting";
    }
}

handlebars.registerHelper('report_issues_list', function (issueIDs, issuesDict, commitsByHash) {
    var templateResult = "";

    for (var i = 0; i < issueIDs.length; i++) {
        var issueDict = issueIDs[i];
        if (issueDict) {
            var issueId = issueDict.issueId;
            var index = issueDict.index;
            
            var issuesArray = issuesDict[issueId];
            if (issuesArray && issuesArray.length) {
                var issue = issuesArray[index];
                if (issue && commitsByHash) {
                    templateResult += templates.new_issue_list({
                        issue: issue, 
                        commitsByHash: commitsByHash
                    });
                }
            }
        }
    }

    return new handlebars.SafeString(templateResult);
});

handlebars.registerHelper('report_commits_list', function (commitsByRepositoryArray, commitsByHash) {
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

handlebars.registerHelper('integrations_summary', function () {
    if (!this) {
        return "";
    }

    if (this.integrations && this.integrations.length) {
        return new handlebars.SafeString(notification_helper.pluralize(this.integrations.length, "Integration"));
    }
    else {
        return "No integrations.";
    }
});

handlebars.registerHelper('commits_summary', function () {
    if (!this) {
        return "";
    }

    if (this.commitsCount && this.commitsCount > 0) {
        return new handlebars.SafeString(notification_helper.pluralize(this.commitsCount, "Commit"));
    }
});

handlebars.registerHelper('issue_count', function(count, type) {
    var color = "#000";
    if (count && type) {
        switch (type) {
            case "error":
                if (count > 0) {
                    color = notification_helper.getColor('error');
                }
                break;
            case "warning":
                if (count > 0) {
                    color = notification_helper.getColor('warning');
                }
                break;
            case "analyzerWarning":
                if (count > 0) {
                    color = notification_helper.getColor('testFailure');
                }
                break;
            case "testFailure":
                if (count > 0) {
                    color = notification_helper.getColor('testFailure');
                }
                break;
            default:
                break;
        }
    }

    return new handlebars.SafeString('<span style="color: '+color+'">'+count+'</span>');
});

handlebars.registerHelper('issue_related_committers', function () {
    if (!this) {
        return "";
    }

    var committers = "";
    if (this.commits && this.commits.length) {
        committers += "Commiters related to the issue: ";
        for (var i = 0; i < this.commits.length; i++) {
            var commit = this.commits[i];
            var contributorName = notification_helper.render_contributor(commit.XCSCommitContributor);
            committers += contributorName+" ";
        }
    }
    return new handlebars.SafeString(committers);
});

handlebars.registerHelper('issue_schedule', function(schedule){
    var scheduleString = "";
    if (schedule) {
        if (schedule === "daily") {
            scheduleString = "Today";
        }
        else if (schedule === "weekly") {
            scheduleString = "This Week";
        }
        else if (schedule === "integration") {
            scheduleString = "This Integration";
        }
    }

    return new handlebars.SafeString(scheduleString);
});

handlebars.registerHelper('issue_schedule_string', function(schedule){
    var scheduleString = "";
    if (schedule) {
        if (schedule === "daily") {
            scheduleString = "Today";
        }
        else if (schedule === "weekly") {
            scheduleString = "in the Last Week";
        }
        else if (schedule === "integration") {
            scheduleString = "in This Integration";
        }
    }

    return new handlebars.SafeString(scheduleString);
});

notification_helper.loadHelperTemplates(handlebars);

exports.html = function (info) {
    return templates.html(info);
};
