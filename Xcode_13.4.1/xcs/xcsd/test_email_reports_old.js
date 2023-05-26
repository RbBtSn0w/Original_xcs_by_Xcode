'use strict';

var fixtures = require('../fixtures.js');
var assert = require('assert');
var notificationClass = require('../../classes/notificationClass.js');
var assertObject = require('../helpers/assertObject.js');
const app = require('../init.js');
const request = require('supertest')(app);
var endpoint = require('../endpoint.js');
var xcsutil = require('../../util/xcsutil.js');

describe("Notifications", function() {

    describe('report email', function () {

        describe('preparing', function() {
            fixtures.preload('request/notifications/before_report_preparation_result','request/notifications/after_report_preparation_results', 'response/notifications/after_report_preparation_results', 'request/notifications/tmp_report');

            describe("result object", function() {

                describe("ok", function() {
                    it("returns the expected result", function(done) {
                        var results = fixtures.getClone('request/notifications/before_report_preparation_result');
                        var afterResults = fixtures.getClone('response/notifications/after_report_preparation_results');
                        notificationClass.prepareResultForReportNotification(results);

                        assert.ok(results);
                        assertObject(results, afterResults);
                        assert.ok(results.hostname);
                        assert.ok(results.hostname !== undefined && results.hostname !== null && results.hostname !== "");
                        done();
                    });
                });

                describe("null", function() {
                    it("returns a null object", function(done) {
                        var results = null;
                        notificationClass.prepareResultForReportNotification(results);
                        assert.equal(results, null);
                        done();
                    });
                });

                describe("empty", function() {
                    it("returns an empty result object", function (done) {
                        var results = {};
                        notificationClass.prepareResultForReportNotification(results);
                        assert.equal(Object.keys(results).length, 0);
                        done();
                    });
                });

                describe("without integrations", function() {
                    it("returns a result object without open issues", function(done) {
                        var results = fixtures.getClone('request/notifications/before_report_preparation_result');
                        results.integrations = [];
                        notificationClass.prepareResultForReportNotification(results);
                        assert.ok(results);
                        assert.ok(results.integrations);
                        assert.equal(results.integrations.length, 0);
                        assert.ok(results.openIssues);
                        assert.equal(results.openIssues.length, 0);
                        assert.ok(results.closedIssues);
                        assert.equal(results.closedIssues.length, 0);
                        done();
                    });
                });

                describe("with integrations null", function() {
                    it("returns a result object without open issues", function(done) {
                        var results = fixtures.getClone('request/notifications/before_report_preparation_result');
                        results.integrations = null;
                        notificationClass.prepareResultForReportNotification(results);
                        assert.ok(results);
                        assert.equal(results.integrations, null);
                        assert.equal(results.issues, undefined);
                        assert.equal(results.openIssues, undefined);
                        assert.equal(results.closedIssues, undefined);
                        done();
                    });
                });

                describe("without issues", function() {
                    it("returns a result object without open issues", function(done) {
                        var results = fixtures.getClone('request/notifications/before_report_preparation_result');
                        results.integrations[0].issues = [];
                        notificationClass.prepareResultForReportNotification(results);
                        assert.ok(results);
                        assert.ok(results.integrations);
                        assert.equal(results.integrations.length, 1);
                        assert.ok(results.integrations[0].issues);
                        assert.equal(results.integrations[0].issues.length, 0);
                        assert.equal(results.openIssues.length, 0);
                        assert.equal(results.closedIssues.length, 0);
                        done();
                    });
                });

                describe("with issues null", function() {
                    it("returns a result object without open issues", function(done) {
                        var results = fixtures.getClone('request/notifications/before_report_preparation_result');
                        results.integrations[0].issues = null;
                        notificationClass.prepareResultForReportNotification(results);
                        assert.ok(results);
                        assert.ok(results.integrations);
                        assert.equal(results.integrations.length, 1);
                        assert.equal(results.openIssues.length, 0);
                        assert.equal(results.closedIssues.length, 0);
                        done();
                    });
                });

                describe("with issues missing", function() {
                    it("returns a result object without open issues", function(done) {
                        var results = fixtures.getClone('request/notifications/before_report_preparation_result');
                        delete results.integrations[0].issues;
                        notificationClass.prepareResultForReportNotification(results);
                        assert.ok(results);
                        assert.ok(results.integrations);
                        assert.equal(results.integrations.length, 1);
                        assert.ok(results.integrations[0]);
                        assert.equal(results.integrations[0].issues, undefined);
                        assert.equal(results.openIssues.length, 0);
                        assert.equal(results.closedIssues.length, 0);
                        done();
                    });
                });

                describe("without commits", function() {
                    it("returns a result object", function(done) {
                        var results = fixtures.getClone('request/notifications/before_report_preparation_result');
                        results.integrations[0].commits = [];
                        notificationClass.prepareResultForReportNotification(results);
                        assert.ok(results);
                        assert.ok(results.integrations);
                        assert.equal(results.integrations.length, 1);
                        assert.equal(results.openIssues.length, 1);
                        assert.equal(results.closedIssues.length, 0);
                        done();
                    });
                });

                describe("with commits null", function() {
                    it("returns a result object without open issues", function(done) {
                        var results = fixtures.getClone('request/notifications/before_report_preparation_result');
                        results.integrations[0].commits = null;
                        notificationClass.prepareResultForReportNotification(results);
                        assert.ok(results);
                        assert.ok(results.integrations);
                        assert.equal(results.integrations.length, 1);
                        assert.equal(results.openIssues.length, 0);
                        assert.equal(results.closedIssues.length, 0);
                        done();
                    });
                });

                describe("with commits missing", function() {
                    it("returns a result object without open issues", function(done) {
                        var results = fixtures.getClone('request/notifications/before_report_preparation_result');
                        results.integrations[0].commits = null;
                        notificationClass.prepareResultForReportNotification(results);
                        assert.ok(results);
                        assert.ok(results.integrations);
                        assert.equal(results.integrations.length, 1);
                        assert.equal(results.openIssues.length, 0);
                        assert.equal(results.closedIssues.length, 0);
                        done();
                    });
                });
            });

            describe("HTML", function() {

                describe("ok", function() {
                    it("returns expected html", function(done) {
                        var afterResults = fixtures.get('request/notifications/after_report_preparation_results');
                        var emails = notificationClass.reportEmail(afterResults, done, {
                            returnHtml: true
                        });
                        assert.ok(emails.length > 0);
                        assert.ok(emails[0]);
                        var message = emails[0];
                        assert.ok(message);
                        assert.ok(message.html);

                        var hostname = xcsutil.machineHostname();
                        var hostnameRegex = new RegExp(hostname, "g");
                        assert.equal(message.html.replace(/ /g, "").replace(/(\r\n|\n|\r)/gm, "").replace(/mathieu2.apple.com/gm, "hostname.apple.com").replace(hostnameRegex, "hostname.apple.com"), '<!DOCTYPEhtmlPUBLIC"-//W3C//DTDXHTML1.0Transitional//EN""http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><htmlxmlns="http://www.w3.org/1999/xhtml"><head><metahttp-equiv="Content-Type"content="text/html;charset=UTF-8"/><title></title><style></style></head><body><tableborder="0"cellpadding="0"cellspacing="0"id="bodyTable"><tr><tdalign="center"valign="top"><tableborder="0"cellpadding="0"cellspacing="0"id="emailContainer"><tr><tdalign="left"valign="top"><tableborder="0"cellpadding="0"cellspacing="0"id="serverInfo"><tr><tdcolspan="2"><strong>Server</strong>:</td></tr><tr><tdwidth="15"></td><td><span><ahref="https://hostname.apple.com/xcode">hostname.apple.com</a></span><br><span>OSX:</span><spanid="osx"></span><br><span>Xcode:</span><spanid="xcode"></span><br><span>OSXServer:</span><spanid="osxServer"></span><br><span>OSXSDK:</span><spanclass="sdk">15C49</span><br><span>tvOSSDK:</span><spanclass="sdk">13Y162</span><br><span>iOSSDK:</span><spanclass="sdk">13E162</span><br><span>watchOSSDK:</span><spanclass="sdk">13V82</span><br></td></tr><tr><td>&nbsp;</td></tr></table><tableborder="0"cellpadding="0"cellspacing="0"id="issueList"><tr><td><strong>Since:</strong></td><td>&nbsp;Dec31,20153:09PM</td></tr><tr><td><strong>To:</strong></td><td>&nbsp;Jan7,20163:09PM</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td></tr></table><tableborder="0"cellpadding="0"cellspacing="0"id="issueList"><tr><tdid="openIssueList"><strong>1OpenIssues</strong>:<br><tableborder="0"cellpadding="0"cellspacing="0"class="issueItem"><tr><tdwidth="15"></td><tdcolspan="2"><spanstyle="color:rgb(195,151,26);">Warning</span><spanclass="issue_introduction">inmyOSXTestApp/myOSXTestApp/Class1.m:18</span></td></tr><tr><tdwidth="15"></td><tdwidth="15"></td><tdclass="issue_message">SemanticIssue:Incompatiblepointertypessending&#x27;NSString*&#x27;toparameteroftype&#x27;NSNumber*&#x27;</td></tr><tr><tdwidth="15"></td><tdwidth="15"></td><td>Commitersrelatedtotheissue:<ahref="mailto:mathieu_rabiller@apple.com">Mathieu2</a></td></tr><tr><tdcolspan="3">&nbsp;</td></tr></table></td></tr></table><tableborder="0"cellpadding="0"cellspacing="0"id="issueList"><tr><tdcolspan="4"><strong>5Commits</strong></td></tr><tr><tdwidth="15"></td><tdcolspan="3"><spanclass="commit_contributor"><ahref="mailto:mathieu_rabiller@apple.com">Mathieu2</a></span></td></tr><trvalign="top"><tdwidth="15"></td><tdwidth="15"></td><tdclass="commit_message">Addednewcomment&nbsp;&nbsp;</td><tdwidth="120"><spanstyle="color:rgb(83,88,95);font-size:90%;white-space:nowrap;"class="commit_date">Dec17,20159:52AM</span></td></tr><trvalign="top"><tdwidth="15"></td><tdwidth="15"></td><tdclass="commit_message">Addednewcomment&nbsp;&nbsp;</td><tdwidth="120"><spanstyle="color:rgb(83,88,95);font-size:90%;white-space:nowrap;"class="commit_date">Dec17,20159:51AM</span></td></tr><trvalign="top"><tdwidth="15"></td><tdwidth="15"></td><tdclass="commit_message">Createdmethodinclass1andloadclass1inviewcontroller&nbsp;&nbsp;</td><tdwidth="120"><spanstyle="color:rgb(83,88,95);font-size:90%;white-space:nowrap;"class="commit_date">Dec17,20159:50AM</span></td></tr><tr><tdwidth="15"></td><tdcolspan="3"><spanclass="commit_contributor"><ahref="mailto:mathieu_rabiller@apple.com">Mathieu3</a></span></td></tr><trvalign="top"><tdwidth="15"></td><tdwidth="15"></td><tdclass="commit_message">Addedclass2&nbsp;&nbsp;</td><tdwidth="120"><spanstyle="color:rgb(83,88,95);font-size:90%;white-space:nowrap;"class="commit_date">Dec17,201510:00AM</span></td></tr><tr><tdwidth="15"></td><tdcolspan="3"><spanclass="commit_contributor"><ahref="mailto:mathieu_rabiller@apple.com">Mathieu4</a></span></td></tr><trvalign="top"><tdwidth="15"></td><tdwidth="15"></td><tdclass="commit_message">Introducedissue&nbsp;&nbsp;</td><tdwidth="120"><spanstyle="color:rgb(83,88,95);font-size:90%;white-space:nowrap;"class="commit_date">Dec17,201510:03AM</span></td></tr><tr><tdcolspan="4">&nbsp;</td></tr></table><tableborder="0"cellpadding="0"cellspacing="0"id="issueList"><tr><tdcolspan="7"><strong>1Integration</strong></td></tr><tr><tdwidth="15">&nbsp;</td><td><tableborder="0"cellpadding="0"cellspacing="0"id="issueList"style="text-align:center;"><tr><tdwidth="30">&nbsp;</td><tdwidth="50">Errors&nbsp;</td><tdwidth="70">Warnings&nbsp;</td><tdwidth="130">AnalyzerWarnings&nbsp;</td><tdwidth="50">Tests&nbsp;</td><tdwidth="85">TestFailures&nbsp;</td></tr><tr><td>#1&nbsp;</td><td><spanstyle="color:#000">0</span>&nbsp;</td><td><spanstyle="color:#000">1</span>&nbsp;</td><td><spanstyle="color:#000">0</span>&nbsp;</td><td><spanstyle="color:#000">0</span>&nbsp;</td><td><spanstyle="color:#000">0</span>&nbsp;</td></tr></table></td></tr><tr><tdcolspan="2">&nbsp;</td></tr></table><tableborder="0"cellpadding="0"cellspacing="0"id="htmlLinks"><tr><td><ahref="xcbot://hostname.apple.com/botID//integrationID/">OpeninXcode</a>|<ahref="https://hostname.apple.com/xcode/bots/">OpeninBrowser</a></td></tr></table></td></tr></table></td></tr></table></body></html>');
                        done();
                    });
                });

                describe("without integrations", function() {
                    it("returns the expected html", function(done) {
                        var afterResults = fixtures.getClone('request/notifications/after_report_preparation_results');
                        afterResults.integrations = [];
                        afterResults.openIssues = [];
                        afterResults.openIssuesCount = 0;
                        var emails = notificationClass.reportEmail(afterResults, done, {
                            returnHtml: true
                        });
                        assert.ok(emails.length > 0);
                        assert.ok(emails[0]);
                        var message = emails[0];
                        assert.ok(message);
                        assert.ok(message.html);

                        var hostname = xcsutil.machineHostname();
                        var hostnameRegex = new RegExp(hostname, "g");
                        assert.equal(message.html.replace(/ /g, "").replace(/(\r\n|\n|\r)/gm, "").replace(/mathieu2.apple.com/gm, "hostname.apple.com").replace(hostnameRegex, "hostname.apple.com"), '<!DOCTYPEhtmlPUBLIC"-//W3C//DTDXHTML1.0Transitional//EN""http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><htmlxmlns="http://www.w3.org/1999/xhtml"><head><metahttp-equiv="Content-Type"content="text/html;charset=UTF-8"/><title></title><style></style></head><body><tableborder="0"cellpadding="0"cellspacing="0"id="bodyTable"><tr><tdalign="center"valign="top"><tableborder="0"cellpadding="0"cellspacing="0"id="emailContainer"><tr><tdalign="left"valign="top"><tableborder="0"cellpadding="0"cellspacing="0"id="serverInfo"><tr><tdcolspan="2"><strong>Server</strong>:</td></tr><tr><tdwidth="15"></td><td><span><ahref="https://hostname.apple.com/xcode">hostname.apple.com</a></span><br><span>OSX:</span><spanid="osx"></span><br><span>Xcode:</span><spanid="xcode"></span><br><span>OSXServer:</span><spanid="osxServer"></span><br><span>OSXSDK:</span><spanclass="sdk">15C49</span><br><span>tvOSSDK:</span><spanclass="sdk">13Y162</span><br><span>iOSSDK:</span><spanclass="sdk">13E162</span><br><span>watchOSSDK:</span><spanclass="sdk">13V82</span><br></td></tr><tr><td>&nbsp;</td></tr></table><tableborder="0"cellpadding="0"cellspacing="0"id="issueList"><tr><td><strong>Since:</strong></td><td>&nbsp;Dec31,20153:09PM</td></tr><tr><td><strong>To:</strong></td><td>&nbsp;Jan7,20163:09PM</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td></tr></table><tableborder="0"cellpadding="0"cellspacing="0"id="issueList"><tr><tdcolspan="4"><strong>5Commits</strong></td></tr><tr><tdwidth="15"></td><tdcolspan="3"><spanclass="commit_contributor"><ahref="mailto:mathieu_rabiller@apple.com">Mathieu2</a></span></td></tr><trvalign="top"><tdwidth="15"></td><tdwidth="15"></td><tdclass="commit_message">Addednewcomment&nbsp;&nbsp;</td><tdwidth="120"><spanstyle="color:rgb(83,88,95);font-size:90%;white-space:nowrap;"class="commit_date">Dec17,20159:52AM</span></td></tr><trvalign="top"><tdwidth="15"></td><tdwidth="15"></td><tdclass="commit_message">Addednewcomment&nbsp;&nbsp;</td><tdwidth="120"><spanstyle="color:rgb(83,88,95);font-size:90%;white-space:nowrap;"class="commit_date">Dec17,20159:51AM</span></td></tr><trvalign="top"><tdwidth="15"></td><tdwidth="15"></td><tdclass="commit_message">Createdmethodinclass1andloadclass1inviewcontroller&nbsp;&nbsp;</td><tdwidth="120"><spanstyle="color:rgb(83,88,95);font-size:90%;white-space:nowrap;"class="commit_date">Dec17,20159:50AM</span></td></tr><tr><tdwidth="15"></td><tdcolspan="3"><spanclass="commit_contributor"><ahref="mailto:mathieu_rabiller@apple.com">Mathieu3</a></span></td></tr><trvalign="top"><tdwidth="15"></td><tdwidth="15"></td><tdclass="commit_message">Addedclass2&nbsp;&nbsp;</td><tdwidth="120"><spanstyle="color:rgb(83,88,95);font-size:90%;white-space:nowrap;"class="commit_date">Dec17,201510:00AM</span></td></tr><tr><tdwidth="15"></td><tdcolspan="3"><spanclass="commit_contributor"><ahref="mailto:mathieu_rabiller@apple.com">Mathieu4</a></span></td></tr><trvalign="top"><tdwidth="15"></td><tdwidth="15"></td><tdclass="commit_message">Introducedissue&nbsp;&nbsp;</td><tdwidth="120"><spanstyle="color:rgb(83,88,95);font-size:90%;white-space:nowrap;"class="commit_date">Dec17,201510:03AM</span></td></tr><tr><tdcolspan="4">&nbsp;</td></tr></table><tableborder="0"cellpadding="0"cellspacing="0"id="htmlLinks"><tr><td><ahref="xcbot://hostname.apple.com/botID//integrationID/">OpeninXcode</a>|<ahref="https://hostname.apple.com/xcode/bots/">OpeninBrowser</a></td></tr></table></td></tr></table></td></tr></table></body></html>');
                        done();
                    });
                });

                describe("without commits", function() {
                    it("returns the expected html", function(done) {
                        var afterResults = fixtures.getClone('request/notifications/after_report_preparation_results');
                        afterResults.commits = [];
                        var emails = notificationClass.reportEmail(afterResults, done, {
                            returnHtml: true
                        });
                        assert.ok(emails.length > 0);
                        assert.ok(emails[0]);
                        var message = emails[0];
                        assert.ok(message);
                        assert.ok(message.html);

                        var hostname = xcsutil.machineHostname();
                        var hostnameRegex = new RegExp(hostname, "g");
                        assert.equal(message.html.replace(/ /g, "").replace(/(\r\n|\n|\r)/gm, "").replace(/mathieu2.apple.com/gm, "hostname.apple.com").replace(hostnameRegex, "hostname.apple.com"), '<!DOCTYPEhtmlPUBLIC"-//W3C//DTDXHTML1.0Transitional//EN""http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><htmlxmlns="http://www.w3.org/1999/xhtml"><head><metahttp-equiv="Content-Type"content="text/html;charset=UTF-8"/><title></title><style></style></head><body><tableborder="0"cellpadding="0"cellspacing="0"id="bodyTable"><tr><tdalign="center"valign="top"><tableborder="0"cellpadding="0"cellspacing="0"id="emailContainer"><tr><tdalign="left"valign="top"><tableborder="0"cellpadding="0"cellspacing="0"id="serverInfo"><tr><tdcolspan="2"><strong>Server</strong>:</td></tr><tr><tdwidth="15"></td><td><span><ahref="https://hostname.apple.com/xcode">hostname.apple.com</a></span><br><span>OSX:</span><spanid="osx"></span><br><span>Xcode:</span><spanid="xcode"></span><br><span>OSXServer:</span><spanid="osxServer"></span><br><span>OSXSDK:</span><spanclass="sdk">15C49</span><br><span>tvOSSDK:</span><spanclass="sdk">13Y162</span><br><span>iOSSDK:</span><spanclass="sdk">13E162</span><br><span>watchOSSDK:</span><spanclass="sdk">13V82</span><br></td></tr><tr><td>&nbsp;</td></tr></table><tableborder="0"cellpadding="0"cellspacing="0"id="issueList"><tr><td><strong>Since:</strong></td><td>&nbsp;Dec31,20153:09PM</td></tr><tr><td><strong>To:</strong></td><td>&nbsp;Jan7,20163:09PM</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td></tr></table><tableborder="0"cellpadding="0"cellspacing="0"id="issueList"><tr><tdid="openIssueList"><strong>1OpenIssues</strong>:<br><tableborder="0"cellpadding="0"cellspacing="0"class="issueItem"><tr><tdwidth="15"></td><tdcolspan="2"><spanstyle="color:rgb(195,151,26);">Warning</span><spanclass="issue_introduction">inmyOSXTestApp/myOSXTestApp/Class1.m:18</span></td></tr><tr><tdwidth="15"></td><tdwidth="15"></td><tdclass="issue_message">SemanticIssue:Incompatiblepointertypessending&#x27;NSString*&#x27;toparameteroftype&#x27;NSNumber*&#x27;</td></tr><tr><tdwidth="15"></td><tdwidth="15"></td><td>Commitersrelatedtotheissue:<ahref="mailto:mathieu_rabiller@apple.com">Mathieu2</a></td></tr><tr><tdcolspan="3">&nbsp;</td></tr></table></td></tr></table><tableborder="0"cellpadding="0"cellspacing="0"id="issueList"><tr><tdcolspan="7"><strong>1Integration</strong></td></tr><tr><tdwidth="15">&nbsp;</td><td><tableborder="0"cellpadding="0"cellspacing="0"id="issueList"style="text-align:center;"><tr><tdwidth="30">&nbsp;</td><tdwidth="50">Errors&nbsp;</td><tdwidth="70">Warnings&nbsp;</td><tdwidth="130">AnalyzerWarnings&nbsp;</td><tdwidth="50">Tests&nbsp;</td><tdwidth="85">TestFailures&nbsp;</td></tr><tr><td>#1&nbsp;</td><td><spanstyle="color:#000">0</span>&nbsp;</td><td><spanstyle="color:#000">1</span>&nbsp;</td><td><spanstyle="color:#000">0</span>&nbsp;</td><td><spanstyle="color:#000">0</span>&nbsp;</td><td><spanstyle="color:#000">0</span>&nbsp;</td></tr></table></td></tr><tr><tdcolspan="2">&nbsp;</td></tr></table><tableborder="0"cellpadding="0"cellspacing="0"id="htmlLinks"><tr><td><ahref="xcbot://hostname.apple.com/botID//integrationID/">OpeninXcode</a>|<ahref="https://hostname.apple.com/xcode/bots/">OpeninBrowser</a></td></tr></table></td></tr></table></td></tr></table></body></html>');
                        done();
                    });
                });
            });

            it("sends an email", function (done) {
//                notificationClass.sendReport("7ecfddaf531bb22e1f507f3ca300c2ad", "weekly", ["mathieu_rabiller@apple.com"]);
//                var results = fixtures.get('request/notifications/after_preparation_report_results');
//                notificationClass.reportEmail(results, done);
//                var afterResults = fixtures.get('request/notifications/after_preparation_results');
//                notificationClass.newIssuesEmails(afterResults, done);
                var beforeResults = fixtures.getClone('request/notifications/tmp_report');
//                notificationClass.prepareResultForReportNotification(beforeResults);

                notificationClass.reportEmail(beforeResults, done);
//                done();
            });
        });

        describe("api endpoint", function() {
            fixtures('bots/drbobert');
            fixtures.custom('integrations/drbobert-48', function(fixtureObject) {
                var newDate = new Date();
                newDate.setHours(newDate.getHours() - 1);
                fixtureObject.endedTimeDate = [
                    newDate.getFullYear(),
                    newDate.getMonth()+1,
                    newDate.getDate(),
                    newDate.getHours(),
                    newDate.getMinutes(),
                    newDate.getSeconds(),
                    newDate.getMilliseconds()
                ];
            });
            fixtures('issues/drbobert-48', 'commits/drbobert-48');

            describe("report", function() {
                endpoint('weekly', endpoint.botViewerRequired, () => {
                    return request.post('/api/report/bot/7ecfddaf531bb22e1f507f3ca300c2ad').send({
                        schedule: "weekly",
                        recipients: ["mathieu_rabiller@apple.com"]
                    });
                }, success => {
                    success(request => {
                        it('send a report notification', done => {
                            request()
                                .expect(200)
                                .end(done);
                        });
                    });
                });
            });

            describe("report", function() {
                endpoint('daily', endpoint.botViewerRequired, () => {
                    return request.post('/api/report/bot/7ecfddaf531bb22e1f507f3ca300c2ad').send({
                        schedule: "daily",
                        recipients: ["mathieu_rabiller@apple.com"]
                    });
                }, success => {
                    success(request => {
                        it('send a report notification', done => {
                            request()
                                .expect(200)
                                .end(done);
                        });
                    });
                });
            });

            describe("report with recipients missing", function() {
                endpoint('weekly', endpoint.botViewerRequired, () => {
                    return request.post('/api/report/bot/7ecfddaf531bb22e1f507f3ca300c2ad').send({
                        schedule: "weekly"
                    });
                }, success => {
                    success(request => {
                        it('send a report notification', done => {
                            request()
                                .expect(400)
                                .end(done);
                        });
                    });
                });
            });

            describe("report with schedule missing", function() {
                endpoint('weekly', endpoint.botViewerRequired, () => {
                    return request.post('/api/report/bot/7ecfddaf531bb22e1f507f3ca300c2ad').send({
                        recipients: ["mathieu_rabiller@apple.com"]
                    });
                }, success => {
                    success(request => {
                        it('send a report notification', done => {
                            request()
                                .expect(400)
                                .end(done);
                        });
                    });
                });
            });

            describe("report with wrong bot id", function() {
                endpoint('weekly', endpoint.botViewerRequired, () => {
                    return request.post('/api/report/bot/1234').send({
                        schedule: "weekly",
                        recipients: ["mathieu_rabiller@apple.com"]
                    });
                }, success => {
                    success(request => {
                        it('send a report notification', done => {
                            request()
                                .expect(404)
                                .end(done);
                        });
                    });
                });
            });

            describe("report", function() {
                endpoint('integration', endpoint.botViewerRequired, () => {
                    return request.post('/api/report/integration/a8490be33fc4b1891668b68d8b1a5e07').send({
                        recipients: ["mathieu_rabiller@apple.com"]
                    });
                }, success => {
                    success(request => {
                        it('send a report notification', done => {
                            request()
                                .expect(200)
                                .end(done);
                        });
                    });
                });
            });

            describe("report with recipients missing", function() {
                endpoint('integration', endpoint.botViewerRequired, () => {
                    return request.post('/api/report/integration/a8490be33fc4b1891668b68d8b1a5e07').send({});
                }, success => {
                    success(request => {
                        it('send a report notification', done => {
                            request()
                                .expect(400)
                                .end(done);
                        });
                    });
                });
            });

            describe("report with wrong integration id", function() {
                endpoint('integration', endpoint.botViewerRequired, () => {
                    return request.post('/api/report/integration/1234').send({
                        recipients: ["mathieu_rabiller@apple.com"]
                    });
                }, success => {
                    success(request => {
                        it('send a report notification', done => {
                            request()
                                .expect(400)
                                .end(done);
                        });
                    });
                });
            });
        });
    });
});
