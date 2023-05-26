var handlebars = require('handlebars'),
    _ = require('underscore'),
    os = require('os');

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
        return '(&darr;' + Math.abs(change) + ')'
    } else {
        return '';
    }
}

handlebars.registerHelper('ifPresent', function(thing, options) {
    if (_.isEmpty(thing)) {
        return options.inverse(this);
    } else {
        return options.fn(this);
    }
});

handlebars.registerHelper('icon', function(result) {
    return isSuccess(result)
        ? String.fromCharCode(0xD83D, 0xDC4D)
        : String.fromCharCode(0xD83D, 0xDC4E);
});

handlebars.registerHelper('result_message', function(integration) {
    var result = integration.result;
    if (result === 'test-failures') {
        return 'failed ' + pluralize(integration.buildResultSummary.testFailureCount, 'test');
    } else if (result === 'build-errors') {
        return 'finished with ' + pluralize(integration.buildResultSummary.errorCount, 'error');
    } else if (result === 'build-failed') {
        return 'failed to build';
    } else if (result === 'warnings') {
        return 'finished with ' + pluralize(integration.buildResultSummary.warningCount, 'warning');
    } else if (result === 'analyzer-warnings') {
        return 'finished with ' + pluralize(integration.buildResultSummary.analyzerWarningCount, 'analyzer warning');
    } else if (result === 'canceled') {
        return 'was canceled';
    } else if (/^internal/.test(result)) {
        return 'finished with an internal error';
    }
    return result;
});

handlebars.registerHelper('issue_summary_row', function(title, type) {
    if (!this.integration.buildResultSummary) return '';

    var count = this.integration.buildResultSummary[type + 'Count'],
        change = this.integration.buildResultSummary[type + 'Change'];

    return new handlebars.SafeString('<tr><td><b>' + title + '</b></td><td>' + count + '</td><td>' + changeString(change) + '</td></tr>');
});

handlebars.registerHelper('results_description', function() {
    var descriptions = [],
        summary = this.integration.buildResultSummary;

    if (summary.errorCount > 0) {
        descriptions.push(pluralize(summary.errorCount, 'Error'));
    }

    if (summary.warningCount > 0) {
        descriptions.push(pluralize(summary.warningCount, 'Warning'));
    }

    if (summary.analyzerWarningCount > 0) {
        descriptions.push(pluralize(summary.analyzerWarningCount, 'Analyzer Warning'));
    }

    if (summary.testsCount > 0) {
        if (summary.testFailureCount > 0) {
            descriptions.push(pluralize(summary.testFailureCount, 'Failed Test') + ' of ' + summary.testsCount);
        } else {
            descriptions.push(pluralize(summary.testsCount, 'Passing Test'));
        }
    }

    if (descriptions.length === 0) {
        descriptions.push('No Issues');
    }

    return descriptions.join(', ');
});

var colors = {
    'error': 'rgb(200, 37, 6)',
    'warning': 'rgb(195, 151, 26)',
    'analyzerWarning': 'rgb(3, 101, 192)',
    'testFailure': 'rgb(200, 37, 6)'
};

function issueMessage(issue) {
    if (issue.testCase) {
        return '<code>' + issue.testCase + '</code><br>' + issue.message;
    }
    return issue.issueType + ': ' + issue.message;
}

function blameMessage(issue) {
    if (issue.age == 0 && _.isEmpty(issue.commits)) {
        return null;
    }

    var message = '<p style="color: #999999">Introduced ';
    if (issue.age > 0) {
        message += pluralize(issue.age, 'integration') + ' ago';

    }
    if (!_.isEmpty(issue.commits)) {
        message += ' by ';
        message += _.uniq(issue.commits.map(function(commit) {
            return commit.XCSCommitContributor.XCSContributorDisplayName +
                ' (' + commit.XCSCommitHash.slice(0, 7) + ')';
        })).join(', ');
    }
    message += '</p>';
    return message;
}

function filePathMessage(issue) {
    if (issue.documentFilePath) {
        return ' in ' + issue.documentFilePath + '<br>';
    }
    return ': ';
}

function renderIssue(issue) {
    return _.compact([
        '<span style="line-height: 1.3em">',
            '<span style="color: ', colors[issue.type], '">',
                humanize(issue.type),
            '</span>',
            filePathMessage(issue),
            '<span style="color: rgb(83, 88, 95)">',
                issueMessage(issue),
            '</span>',
        '</span>',
        '<br>',
        blameMessage(issue),
    ]).join('');
}

handlebars.registerHelper('issue_list', function(title, key) {
    if (!this.issues) return '';

    var types = ['error', 'testFailure', 'warning', 'analyzerWarning'],
        issues = this.issues,
        allIssues = _.flatten(types.map(function(type) {
            return issues[type + 's'][key].map(function(issue) {
                return _.extend({type: type}, issue);
            });
        }));

    if (_.isEmpty(allIssues)) return '';

    var firstIssueType = allIssues[0].type,
        allSameType = _.every(allIssues, function (issue) { return issue.type === firstIssueType }),
        headerString = allSameType ? humanize(firstIssueType) + 's' : 'Issues',
        listString = allIssues.map(renderIssue).join('');

    var result = '<br><h3>' + title + ' ' + headerString + ' (' + allIssues.length + ')</h3>' + listString;
    return new handlebars.SafeString(result);
});

handlebars.registerHelper('service_issues', function() {
    var errors = this.issues.buildServiceErrors || [],
        warnings = this.issues.buildServiceWarnings || [],
        issues = errors.concat(warnings);

    if (_.isEmpty(issues)) return '';

    var listString = issues.map(renderIssue).join(''),
        result = '<br><h3>Service Issues (' + issues.length + ')</h3>' + listString;
    return new handlebars.SafeString(result);
});

function renderContributor(contributor) {
    var name = _.escape(contributor.XCSContributorDisplayName),
        username = contributor.XCSContributorName,
        email = _.escape(contributor.XCSContributorEmails[0]);

    if (name && name.length !== 0) {
        return '<a href="mailto:' + email + '">' + name + '</a>';
    } else if (email.indexOf('@') !== -1) {
        return '<a href="mailto:' + email + '">' + email + '</a>';
    } else {
        return email;
    }
}

handlebars.registerHelper('contributor', function(contributor) {
    return new handlebars.SafeString(renderContributor(contributor));
});

handlebars.registerHelper('contributors', function() {
    var contributors = _.uniq(_.pluck(this.commits, 'XCSCommitContributor').map(renderContributor));
    return new handlebars.SafeString(contributors.join(', '));
});

handlebars.registerPartial('header', require('./_email_header.hbs'));
handlebars.registerPartial('html_links', require('./_email_html_links.hbs'));
handlebars.registerPartial('commit', require('./_email_commit.hbs'));

var defaultEmailConfiguration = {
    includeIssueDetails: true,
    includeCommitMessages: true
};

function decorate(info) {
    return {
        integration: info.integration,
        issues: info.issues,
        commits: info.commits ? _.flatten(info.commits.commits) : [],
        config: info.trigger.emailConfiguration || defaultEmailConfiguration,
        hostname: os.hostname()
    };
}

var templates = {
    subject: require('./email_subject.hbs'),
    text: require('./email_text.hbs'),
    html: require('./email_html.hbs')
};

exports.subject = templates.subject;
exports.text = function(info) {
    return templates.text(decorate(info));
};
exports.html = function(info) {
    return templates.html(decorate(info));
};
