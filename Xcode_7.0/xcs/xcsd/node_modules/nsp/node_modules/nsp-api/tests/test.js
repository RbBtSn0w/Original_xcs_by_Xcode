var Lab = require('lab');
var lab = exports.lab = Lab.script();
var nspAPI = require('../');

var suite = lab.suite;
var test = lab.test;
var before = lab.before;
var after = lab.after;
var expect = Lab.expect;

suite('validate', function() {

    test('returns vulnerability for module', function(done) {
        nspAPI.validateModule('yar', '0.1.0', function(err, results) {
            expect(err).to.eql(null);
            expect(results).to.be.an('array');
            expect(results).to.have.length.gt(0);
            done();
        });
    });

    var shrinkwrap = {
        name: 'nsp-api',
        version: '1.0.0',
        dependencies: {
            yar: {
                version: '0.1.0',
                from: '0.1.x',
                resolved: 'https://registry.npmjs.org/yar/-/yar-0.1.0.tgz'
            }
        }
    };

    test('returns vulnerability for shrinkwrap.json', function(done) {
        nspAPI.validateShrinkwrap(shrinkwrap, function(err, results) {
            expect(err).to.eql(null);
            expect(results).to.be.an('array');
            expect(results).to.have.length.gt(0);
            done();
        });
    });
});
