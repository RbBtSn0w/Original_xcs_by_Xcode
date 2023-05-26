'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var handlebars = require('handlebars'),
    _ = require('underscore'),
    os = require('os'),
    xcsutil = require('../util/xcsutil.js');

function isSuccess(result) {
    return result === 'succeeded' || result === 'warnings' || result === 'analyzer-warnings';
}

function pluralize(count, str) {
    // not very intelligent, but good enough for us
    return '' + count + ' ' + (count === 1 ? str : str + 's');
}

function humanize(str) {
    return str.split(/([A-Z][a-z]+)/).map(function (str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }).join(' ').trim();
}

function changeString(change) {
    if (change > 0) {
        return '(&uarr;' + change + ')';
    } else if (change < 0) {
        return '(&darr;' + Math.abs(change) + ')';
    } else {
        return '';
    }
}

function htmlEscape(inString) {
	if (inString !== undefined && inString !== null) {
		return handlebars.Utils.escapeExpression(inString);
	}
	else {
		return '';
	}
}

handlebars.registerHelper('ifPresent', function (thing, options) {
    if (_.isEmpty(thing)) {
        return options.inverse(this);
    } else {
        return options.fn(this);
    }
});

handlebars.registerHelper('icon', function (result) {
    return isSuccess(result) ? String.fromCharCode(0xD83D, 0xDC4D) : String.fromCharCode(0xD83D, 0xDC4E);
});

var conditionMappings = {
    error: 'onBuildErrors',
    testFailure: 'onFailingTests',
    warning: 'onWarnings',
    analyzerWarning: 'onAnalyzerWarnings'
};

function basicResultMessage(integration) {
    var result = integration.result;
    if (result === 'test-failures') {
        return 'failed ' + pluralize(integration.buildResultSummary.testFailureCount, 'test');
    } else if (result === 'build-errors') {
        return 'finished with ' + pluralize(integration.buildResultSummary.errorCount, 'error');
    } else if (result === 'build-failed') {
        return 'failed to build';
    } else if (result === 'warnings' || result === 'analyzer-warnings') {
        var warningCount = integration.buildResultSummary.warningCount;
        var analyzerWarningCount = integration.buildResultSummary.analyzerWarningCount;
        if (warningCount && analyzerWarningCount) {
            var issueCount = warningCount + analyzerWarningCount;
            return 'finished with ' + pluralize(issueCount, 'issue') + ' (' + pluralize(warningCount, 'warning') + ', ' + pluralize(analyzerWarningCount, 'analyzer warning') + ')';
        } else {
            if (warningCount) {
                return 'finished with ' + pluralize(warningCount, 'warning');
            } else {
                return 'finished with ' + pluralize(analyzerWarningCount, 'analyzer warning');
            }
        }
    } else if (result === 'canceled') {
        return 'was canceled';
    } else if (result === 'checkout-error') {
        return 'failed to check out sources';
    } else if (result === 'trigger-error') {
        return 'failed with trigger errors';
    } else if (/^internal/.test(result)) {
        return 'finished with an internal error';
    }
    return result;
}

function allClearMessage(integration, conditions) {
    var summary = integration.buildResultSummary,
        components = [],
        types = ['error', 'testFailure', 'warning', 'analyzerWarning'];

    types.forEach(function (type) {
        var on = conditionMappings[type],
            change = type + 'Change',
            count = type + 'Count';

        if (conditions[on] && summary[change] < 0 && summary[count] === 0) {
            components.push(pluralize(-summary[change], humanize(type).toLowerCase()));
        }
    });

    if (components.length > 0) {
        return basicResultMessage(integration) + ' (resolved final ' + components.join(', ') + ')';
    } else {
        return basicResultMessage(integration);
    }
}

handlebars.registerHelper('result_message', function (integration) {
    if (this.allClear) {
        return allClearMessage(integration, this.conditions);
    }

    return basicResultMessage(integration);
});

handlebars.registerHelper('issue_summary_row', function (title, type) {
    if (!this.integration.buildResultSummary) {
        return '';
    }

    var count = this.integration.buildResultSummary[type + 'Count'],
        change = this.integration.buildResultSummary[type + 'Change'];

    return new handlebars.SafeString('<tr><td><b>' + title + '</b></td><td>' + count + '</td><td>' + changeString(change) + '</td></tr>');
});

function lineReturn(inString) {
    if (inString !== '') {
        inString += '<br />';
    }
    return inString;
}

handlebars.registerHelper('results_description', function () {
    var descriptions = '',
        summary = this.integration.buildResultSummary;

    if (summary.errorCount > 0) {
        descriptions += '<span>&nbsp;&nbsp;&nbsp;' + htmlEscape(pluralize(summary.errorCount, 'error')) + '</span>';
    }

    if (summary.warningCount > 0) {
        descriptions = lineReturn(descriptions);
        descriptions += '<span>&nbsp;&nbsp;&nbsp;' + htmlEscape(pluralize(summary.warningCount, 'warning')) + '</span>';
    }

    if (summary.analyzerWarningCount > 0) {
        descriptions = lineReturn(descriptions);
        descriptions += '<span>&nbsp;&nbsp;&nbsp;' + htmlEscape(pluralize(summary.analyzerWarningCount, 'analyzer warning')) + '</span>';
    }

    if (summary.testsCount > 0) {
        descriptions = lineReturn(descriptions);
        if (summary.testFailureCount === summary.testsCount) {
            descriptions += '<span>&nbsp;&nbsp;&nbsp;' + htmlEscape(pluralize(summary.testFailureCount, 'failing test')) + '</span>';
        } else if (summary.testFailureCount > 0) {
            descriptions += '<span>&nbsp;&nbsp;&nbsp;' + htmlEscape(pluralize(summary.testsCount, 'test') + ' (' + summary.testFailureCount) + ' failing)</span>';
        } else {
            descriptions += '<span>&nbsp;&nbsp;&nbsp;' + htmlEscape(pluralize(summary.testsCount, 'passing test')) + '</span>';
        }
    }

    if (descriptions === '') {
        descriptions = 'No issues';
    }

    return new handlebars.SafeString(descriptions);
});

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

function issueMessage(issue) {
    var message = issue.message;
    var rawMessageArray = message.split('\n');
    var rawMessage = '';
    var doNotDisplayIssueTypes = ['buildServiceWarning', 'buildServiceError', 'triggerError'];
    
    for (var i = 0; i < 5; i++) {
        if (typeof (rawMessageArray[i]) !== 'undefined') { 
            if (i > 0) {  
                rawMessage += '<br />';
            }
            rawMessage += htmlEscape(rawMessageArray[i]);
        }
    }

    if (issue.testCase) {
        return '<code>' + htmlEscape(issue.testCase) + '</code><br>' + rawMessage;
    }
    
    if (doNotDisplayIssueTypes.indexOf(issue.issueType) !== -1) {
        return  rawMessage;
    }
    else {
        return htmlEscape(issue.issueType) + ': ' + rawMessage;
    }
}

function getAssociation(issue, type) {
    return issue.associations && issue.associations[type];
}

function blameMessage(issue) {
    if (issue.age === 0 && _.isEmpty(issue.commits)) {
        return null;
    }

    var message = '<br><span style="color: #999999">',
        assignee = getAssociation(issue, 'assignee'),
        radar = getAssociation(issue, 'radar');
    if (radar) {
        message += 'Tracked by &lt;rdar://problem/' + htmlEscape(radar.problemID) + '&gt;. ';
    }
    if (assignee) {
        message += 'Claimed by ' + htmlEscape(assignee.username) + '. ';
    }

    message += 'Introduced ';
    if (issue.age > 0) {
        message += htmlEscape(pluralize(issue.age, 'integration') + ' ago');

    }
    if (!_.isEmpty(issue.commits)) {
        message += ' by ';
        message += _.uniq(issue.commits.map(function (commit) {
            return htmlEscape(commit.XCSCommitContributor.XCSContributorDisplayName +
                ' (' + commit.XCSCommitHash.slice(0, 7) + ')');
        })).join(', ');
    }
    message += '</span>';
    return message;
}

function filePathMessage(issue) {
    if (issue.documentFilePath) {
        var fileName = issue.documentFilePath;
        if (issue.lineNumber) {
            fileName += ':' + issue.lineNumber;
        }
        return ' in ' + htmlEscape(fileName) + '<br>';
    }
    return ': ';
}

function renderIssue(issue) {
    var color = issue.status === 2 ? colors.resolved : colors[issue.type];

    return _.compact([
        '<p style="line-height: 1.3em">',
            '<span style="color: ', color, '">',
                humanize(issue.type),
            '</span>',
            filePathMessage(issue),
            '<span style="color: rgb(83, 88, 95)">',
                issueMessage(issue),
            '</span>',
            blameMessage(issue),
        '</p>'
    ]).join('');
}

handlebars.registerHelper('issue_list', function (title, key) {
    if (!this.issues) {
        return '';
    }

    var types = ['error', 'testFailure', 'warning', 'analyzerWarning'],
        issues = this.issues,
        allIssues = _.flatten(types.map(function (type) {
            return issues[type + 's'][key].map(function (issue) {
                return _.extend({
                    type: type
                }, issue);
            });
        }));

    if (_.isEmpty(allIssues)) {
        return '';
    }

    var firstIssueType = allIssues[0].type,
        allSameType = _.every(allIssues, function (issue) {
            return issue.type === firstIssueType;
        }),
        headerString = allSameType ? htmlEscape(humanize(firstIssueType) + 's') : 'Issues',
        listString = allIssues.map(renderIssue).join('\n');

    var result = '<h3>' + htmlEscape(title + ' ' + headerString + ' (' + allIssues.length) + ')</h3>' + listString;
    return new handlebars.SafeString(result);
});

handlebars.registerHelper('performance_issues', function () {
    var message = '<strong>Performance</strong>:<br />';
    var regressionPerfTestCount = 0;
    var improvedPerfTestCount = 0;

    if (this.integration !== undefined && this.integration.buildResultSummary !== undefined) {
        regressionPerfTestCount = this.integration.buildResultSummary.regressedPerfTestCount;
        improvedPerfTestCount = this.integration.buildResultSummary.improvedPerfTestCount;
    }

    if (regressionPerfTestCount > 0) {
        message += '<span>&nbsp;&nbsp;&nbsp;' + htmlEscape(pluralize(regressionPerfTestCount, 'performance test')) + ' have regressed.</span><br />';
    }
    if (improvedPerfTestCount > 0) {
        message += '<span>&nbsp;&nbsp;&nbsp;' + htmlEscape(pluralize(improvedPerfTestCount, 'performance test')) + ' have improved.</span><br />';
    }

    if (regressionPerfTestCount === 0 && improvedPerfTestCount === 0) {
        message = '';
    } else {
        message += '<br /><br />';
    }

    return new handlebars.SafeString(message);
});

handlebars.registerHelper('code_coverage', function () {
    var message = '<strong>Code Coverage</strong>:<br />';
    var coveragePercentage = null;
    var coverageDelta = null;

    if (this.integration !== undefined && this.integration.buildResultSummary !== undefined) {
        coveragePercentage = this.integration.buildResultSummary.codeCoveragePercentage;
        coverageDelta = this.integration.buildResultSummary.codeCoveragePercentageDelta;
    }

    if (this.integration !== undefined && this.integration.bot !== undefined && this.integration.bot.configuration !== undefined && this.integration.bot.configuration.codeCoveragePreference > 0 && coveragePercentage !== undefined && coveragePercentage !== null) {
        message += '<span>&nbsp;&nbsp;&nbsp;' + htmlEscape(coveragePercentage) + '% of the code is covered by unit tests</span><br />';
        if (coverageDelta !== undefined && coverageDelta !== null && coverageDelta > 0) {
            message += '<span>&nbsp;&nbsp;&nbsp;Code coverage has improved by ' + htmlEscape(coverageDelta) + '%</span><br />';
        } else if (coverageDelta !== undefined && coverageDelta !== null && coverageDelta < 0) {
            message += '<span>&nbsp;&nbsp;&nbsp;Code coverage has regressed by ' + htmlEscape(Math.abs(coverageDelta)) + '%</span><br />';
        }
        message += '<br /><br />';
    } else {
        message = '';
    }

    return new handlebars.SafeString(message);
});

handlebars.registerHelper('service_issues', function () {
    var errors = this.issues.buildServiceErrors || [],
        warnings = this.issues.buildServiceWarnings || [],
        triggerErrors = this.issues.triggerErrors || [],
        issues = errors.concat(triggerErrors, warnings);

    if (_.isEmpty(issues)) {
        return '';
    }

    var listString = issues.map(renderIssue).join(''),
        result = '<h3>Service Issues (' + issues.length + ')</h3>' + listString;
    return new handlebars.SafeString(result);
});

function renderContributor(contributor) {
    var name = _.escape(contributor.XCSContributorDisplayName),
        email = _.escape(contributor.XCSContributorEmails[0]);

    if (name && name.length !== 0) {
        return '<a href="mailto:' + htmlEscape(email) + '">' + htmlEscape(name) + '</a>';
    } else if (email.indexOf('@') !== -1) {
        return '<a href="mailto:' + htmlEscape(email) + '">' + htmlEscape(email) + '</a>';
    } else {
        return email;
    }
}

handlebars.registerHelper('contributor', function (contributor) {
    return new handlebars.SafeString(renderContributor(contributor));
});

handlebars.registerHelper('contributors', function () {
    var contributors = _.uniq(_.pluck(this.commits, 'XCSCommitContributor').map(renderContributor));
    return new handlebars.SafeString(contributors.join(', '));
});

handlebars.registerHelper('issues_originators', function () {
    if (!this.issues) {
        return '';
    }

    var types = ['error', 'testFailure', 'warning', 'analyzerWarning'],
        typeStrings = {
            'error': 'error',
            'testFailure': 'test failure',
            'warning': 'warning',
            'analyzerWarning': 'analyzer warning'
        },
        issues = this.issues,
        allFreshIssues = _.flatten(types.map(function (type) {
            return issues[type + 's'].freshIssues.map(function (issue) {
                return _.extend({
                    type: type
                }, issue);
            });
        })),
        allResolvedIssues = _.flatten(types.map(function (type) {
            return issues[type + 's'].resolvedIssues.map(function (issue) {
                return _.extend({
                    type: type
                }, issue);
            });
        })),
        contributorIssues = {},
        contributorSolvedIssues = {},
        message = '';

    function returnContributorDisplayName(commit) {
        return htmlEscape(commit.XCSCommitContributor.XCSContributorDisplayName);
    }

    function createCreatorIssuesMessage(contributorIssues, type) {
        if (Object.keys(contributorIssues).length > 0) {
            for (var contributorName in contributorIssues) {
                if (contributorName !== null && contributorName !== '') {
                    var contributorIssueTypes = contributorIssues[contributorName];
                    var contributorIssuesMessage = '<span>&nbsp;&nbsp;&nbsp;' + htmlEscape(contributorName + ' ' + type);
                    var contributorHasIssues = false;

                    for (var issueType in contributorIssueTypes) {
                        if (issueType !== null && issueType !== '' && contributorIssueTypes[issueType] > 0) {
                            if (!contributorHasIssues) {
                                contributorHasIssues = true;
                            } else {
                                contributorIssuesMessage += ',';
                            }
                            contributorIssuesMessage += htmlEscape(' ' + pluralize(contributorIssueTypes[issueType], typeStrings[issueType]));
                        }
                    }
                    if (contributorHasIssues) {
                        contributorIssuesMessage += '.</span><br />';
                    } else {
                        contributorIssuesMessage = '';
                    }

                    message += contributorIssuesMessage;
                }
            }
        }
    }

    for (var i = 0; i < allFreshIssues.length; i++) {
        var freshIssue = allFreshIssues[i];
        var freshContributors = _.uniq(freshIssue.commits.map(returnContributorDisplayName));

        for (var j = 0; j < freshContributors.length; j++) {
            var freshContributor = freshContributors[j];
            if (contributorIssues[freshContributor] === undefined) {
                contributorIssues[freshContributor] = {};
                types.map(function mapTypesToDictionary(type) {
                    contributorIssues[freshContributor][type] = 0;
                });
            }
            contributorIssues[freshContributor][freshIssue.type] += 1;
        }
    }

    for (var k = 0; k < allResolvedIssues.length; k++) {
        var resolvedIssue = allResolvedIssues[k];
        var resolvedContributors = _.uniq(resolvedIssue.commits.map(returnContributorDisplayName));

        for (var m = 0; m < resolvedContributors.length; m++) {
            var resolvedContributor = resolvedContributors[m];
            if (contributorSolvedIssues[resolvedContributor] === undefined) {
                contributorSolvedIssues[resolvedContributor] = {};
                types.map(function mapTypesToDictionary(type) {
                    contributorSolvedIssues[resolvedContributor][type] = 0;
                });
            }
            contributorSolvedIssues[resolvedContributor][resolvedIssue.type] += 1;
        }
    }

    if (Object.keys(contributorIssues).length > 0) {
        message += '<strong>New Issues</strong>:<br />';
        createCreatorIssuesMessage(contributorIssues, 'introduced');
    }

    if (Object.keys(contributorIssues).length > 0 && Object.keys(contributorSolvedIssues).length > 0) {
        message += '<br /><br />';
    }

    if (Object.keys(contributorSolvedIssues).length > 0) {
        message += '<strong>Resolved Issues</strong>:<br />';
        createCreatorIssuesMessage(contributorSolvedIssues, 'solved');
    }

    if (Object.keys(contributorIssues).length === 0 && Object.keys(contributorSolvedIssues).length === 0) {
        message = '';
    } else {
        message = '<br /><br />' + message;
    }

    return new handlebars.SafeString(message);
});

handlebars.registerPartial('version_info', require('./_email_version.hbs'));
handlebars.registerPartial('header', require('./_email_header.hbs'));
handlebars.registerPartial('html_links', require('./_email_html_links.hbs'));
handlebars.registerPartial('commit', require('./_email_commit.hbs'));

var defaultEmailConfiguration = {
    includeIssueDetails: true,
    includeCommitMessages: true
};

function decorate(info) {
    return {
        versions: info.versions,
        platforms: info.platforms,
        integration: info.integration,
        issues: info.issues,
        commits: info.commits ? _.flatten(info.commits.commits) : [],
        config: info.trigger.emailConfiguration || defaultEmailConfiguration,
        conditions: info.trigger.conditions,
        hostname: xcsutil.machineHostname(),
        allClear: info.allClear
    };
}

var templates = {
    subject: require('./email_subject.hbs'),
    text: require('./email_text.hbs'),
    html: require('./email_html.hbs')
};

exports.subject = function (info) {
    return templates.subject(decorate(info));
};
exports.text = function (info) {
    return templates.text(decorate(info));
};
exports.html = function (info) {
    return templates.html(decorate(info));
};