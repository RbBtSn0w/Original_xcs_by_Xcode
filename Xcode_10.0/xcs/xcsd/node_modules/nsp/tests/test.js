var Lab = require('lab');
var Code = require('code');
var lab = exports.lab = Lab.script();
var sinon = require('sinon');
var rewire = require('rewire');

var auditPackage = rewire('./../lib/auditPackage');
var fixtures = require('./data/fixtures');
var experiment = lab.experiment;
var test = lab.test;
var before = lab.before;
var after = lab.after;
var expect = Code.expect;

experiment('auditPackage', {timeout: 5000}, function() {
    var validateStub;
    var sandbox = sinon.sandbox.create();

    before(function(done) {
        validateStub = sandbox.stub();

        validateStub.withArgs('qs').yields(null, fixtures['qs@0.5.x']);
        validateStub.yields(null, []);

        auditPackage.__set__('validateModule', validateStub);
        done();
    });

    after(function(done) {
        auditPackage.validateModule.restore();
        sandbox.restore();
        done();
    });

    test('should return a list of advisory for a vulnerable package',
        function(done) {

        auditPackage('tests/data/vulnerable-package.json',
            function(err, results) {
            var qs = fixtures.qsVulnerabilityResponse;

            expect(err).to.not.exist();
            expect(2).to.equal(results.length);
            // expect(results).to.deep.equal(qs);
            done();
        });
    });

    test('should return a valid list of ancestors', function(done) {

        auditPackage('tests/data/transitive-dependency.json',
            function(err, results) {

            var ancestry = ['root@0.0.1',
                            'couchbase@1.2.2',
                            'request@2.30.0',
                            'qs@0.6.6'];

            expect(err).to.not.exist();
            expect(1).to.equal(results.length);
            expect(ancestry).to.deep.equal(results[0].dependencyOf);

            done();
        });
    });

    test('should return an empty result list wtesth gtest dependencies',
        function(done) {

        validateStub.returns([]);

        auditPackage('tests/data/git-deps-package.json',
            function(err, results) {

            expect(err).to.not.exist();
            expect(0).to.equal(results.length);

            done();
        });
    });

    test('should not break after auditing a non public module',
        function(done) {

        auditPackage('tests/data/non-public-module.json',
            function(err, results) {

            expect(err).to.not.exist();
            expect(1).to.equal(results.length);

            done();
        });
    });

});
