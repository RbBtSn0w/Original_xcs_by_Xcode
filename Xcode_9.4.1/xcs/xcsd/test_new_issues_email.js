'use strict';

var fixtures = require('../fixtures.js');
var assert = require('assert');
var notificationClass = require('../../classes/notificationClass.js');
var assertObject = require('../helpers/assertObject.js');
var xcsutil = require('../../util/xcsutil.js');

describe('New issues email', function () {

    describe('preparing', function () {
        
        describe("result object", function () {
            fixtures.preload('request/notifications/before_preparation_results');
            fixtures.preload('request/notifications/after_preparation_results');
            
            describe("ok", function() {
                it("returns the expected result", function (done) {
                    var results = fixtures.getClone('request/notifications/before_preparation_results');
                    var afterResults = fixtures.getClone('request/notifications/after_preparation_results');
                    notificationClass.prepareResultForNewIssueNotification(results);
                    assert.ok(results);
                    assertObject(results, afterResults);
                    done();
                });
            });
            
            describe("null", function() {
                it("returns a null object", function (done) {
                    var results = null;
                    notificationClass.prepareResultForNewIssueNotification(results);
                    assert.equal(results, null);
                    done();
                });
            });

            describe("empty", function() {
                it("returns a result object with empty issue authors", function (done) {
                    var results = {};
                    notificationClass.prepareResultForNewIssueNotification(results);
                    assert.equal(Object.keys(results).length, 1);
                    assert.ok(results.issuesByAuthor);
                    assert.equal(Object.keys(results.issuesByAuthor).length, 0);
                    done();
                });
            });
            
            describe("with no fresh issues", function () {
                it("returns no issues by author", function (done) {
                    var results = fixtures.getClone('request/notifications/before_preparation_results');
                    results.issues.errors.freshIssues = [];
                    results.issues.testFailures.freshIssues = [];
                    results.issues.warnings.freshIssues = [];
                    results.issues.analyzerWarnings.freshIssues = [];
                    notificationClass.prepareResultForNewIssueNotification(results);

                    assert.ok(results);
                    assert.ok(results.issuesByAuthor);
                    assert.equal(Object.keys(results.issuesByAuthor).length, 0);
                    done();
                });
            });

            describe("with no issues", function () {
                it("returns no issues by author", function (done) {
                    var results = fixtures.getClone('request/notifications/before_preparation_results');
                    results.issues = {};
                    assert.ok(results);
                    assert.ok(results.issuesByAuthor === undefined);
                    done();
                });
            });

            describe("with issues null", function () {
                it("returns no issues by author", function (done) {
                    var results = fixtures.getClone('request/notifications/before_preparation_results');
                    results.issues = {};
                    assert.ok(results);
                    assert.ok(results.issuesByAuthor === undefined);
                    done();
                });
            });

            describe("with no commits", function () {
                it("returns no issues by author", function (done) {
                    var results = fixtures.getClone('request/notifications/before_preparation_results');
                    results.commits = {};
                    assert.ok(results);
                    assert.ok(results.issuesByAuthor === undefined);
                    done();
                });
            });
            
            describe("with commits null", function () {
                it("returns no issues by author", function (done) {
                    var results = fixtures.getClone('request/notifications/before_preparation_results');
                    results.commits = null;
                    assert.ok(results);
                    assert.ok(results.issuesByAuthor === undefined);
                    done();
                });
            });
        });
        
        
        
        describe("html", function() {
            fixtures.preload('request/notifications/before_preparation_results');
            fixtures.preload('request/notifications/after_preparation_results');
            fixtures.preload('request/notifications/after_preparation_results_without_issues');
            
            
            describe("ok", function() {
                it("returns expected html", function (done) {
                    var afterResults = fixtures.get('request/notifications/after_preparation_results');
                    var emails = notificationClass.newIssuesEmails(afterResults, function(){}, {
                        returnHtml: true
                    });
                    
                    assert.ok(emails.length > 0);
                    assert.ok(emails[0]);
                    var message = emails[0];
                    assert.ok(message);
                    assert.ok(message.html);
                    var hostname = xcsutil.machineHostname();
                    var hostnameRegex = new RegExp(hostname, "g");
                    assert.equal(message.html.replace(/ /g, "").replace(/(\r\n|\n|\r)/gm, "").replace(/mathieu2.apple.com/gm, "hostname.apple.com").replace(hostnameRegex, "hostname.apple.com"), '<!DOCTYPEhtmlPUBLIC"-//W3C//DTDXHTML1.0Transitional//EN""http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><htmlxmlns="http://www.w3.org/1999/xhtml"><head><metahttp-equiv="Content-Type"content="text/html;charset=UTF-8"/><title></title><style></style></head><body><tableborder="0"cellpadding="0"cellspacing="0"id="bodyTable"><tr><tdalign="center"valign="top"><tableborder="0"cellpadding="0"cellspacing="0"id="emailContainer"><tr><tdalign="left"valign="top"><tableborder="0"cellpadding="0"cellspacing="0"id="serverInfo"><tr><tdcolspan="2"><strong>Server</strong>:</td></tr><tr><tdwidth="15"></td><td><span><ahref="https://hostname.apple.com/xcode">hostname.apple.com</a></span><br><span>OSX:</span><spanid="osx">10.11.2(15C50)</span><br><span>Xcode:</span><spanid="xcode">7.3(7D104)</span><br><span>OSXServer:</span><spanid="osxServer">5.0.16(15S5021)</span><br><span>OSXSDK:</span><spanclass="sdk">15C49</span><br><span>tvOSSDK:</span><spanclass="sdk">13Y162</span><br><span>iOSSDK:</span><spanclass="sdk">13E162</span><br><span>watchOSSDK:</span><spanclass="sdk">13V82</span><br></td></tr><tr><td>&nbsp;</td></tr></table><tableborder="0"cellpadding="0"cellspacing="0"id="issueList"><tr><tdid="issueList"><strong>Issues</strong>:<br><tableborder="0"cellpadding="0"cellspacing="0"class="issueItem"><tr><tdcolspan="3"><spanstyle="color:rgb(195,151,26);">Warning</span><spanclass="issue_introduction">inmyOSXTestApp/myOSXTestApp/ViewController.m:21</span></td></tr><tr><tdwidth="15"></td><tdcolspan="2"><spanclass="reason_for_assignment">Acommitmadebyyouintroducedthisissue.</span></td></tr><tr><tdwidth="15"></td><tdcolspan="2"class="issue_message">User-DefinedIssue:Newwarningissue</td></tr><tr><tdwidth="15"></td><tdcolspan="2"><spanclass="commit_contributor"><ahref="mailto:mathieu_rabiller@apple.com">MathieuRabiller</a></span>-<codestyle="color:rgb(83,88,95);font-size:90%;"><bclass="commit_hash">eee84e3</b></code>-<spanstyle="color:rgb(83,88,95);font-size:90%;"class="commit_date">Nov19,201512:54PM</span></td></tr><tr><tdwidth="15"></td><tdwidth="15"></td><tdclass="commit_message">addingwarning</td></tr><tr><tdwidth="15"></td><tdwidth="15"></td><td><spanstyle="color:#808080;font-size:80%;"class="file_path">myOSXTestApp/ViewController.m</span></td></tr><tr><tdcolspan="3">&nbsp;</td></tr></table></td></tr></table><tableborder="0"cellpadding="0"cellspacing="0"id="htmlLinks"><tr><td><ahref="xcbot://hostname.apple.com/botID/98a77e3fc782149cb626aa149b02c7f4/integrationID/98a77e3fc782149cb626aa149b02cbbc">OpeninXcode</a>|<ahref="https://hostname.apple.com/xcode/bots/9CC9FF1">OpeninBrowser</a></td></tr></table></td></tr></table></td></tr></table></body></html>');

                    done();
                });
            });
               
            describe("without issue authors", function() {
                it("doesn't send emails", function (done) {
                    var afterResults = fixtures.get('request/notifications/after_preparation_results_without_issues');
                    var emails = notificationClass.newIssuesEmails(afterResults, function() {}, {
                        returnHtml: true
                    });
                    
                    assert.ok(emails);
                    assert.equal(emails.length, 0);

                    done();
                });
            });
        });
        
//        fixtures.preload('request/notifications/after_preparation_results', 'request/notifications/tmp_before_preparation_new_issue');
//        it("sends an email", function (done) {
//            var afterResults = fixtures.get('request/notifications/tmp_before_preparation_new_issue');
//            notificationClass.newIssuesEmails(afterResults, done);
//            //done();
//        });
    });
});