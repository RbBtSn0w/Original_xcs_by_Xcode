var request = require('request');

exports = module.exports;

exports.validateModule = function(module, version, cb) {
    var url = 'https://nodesecurity.io/validate/' + module + '/' + version;
    request({
        url: url,
        method: 'GET',
        headers: {
            'content-type': 'application/json'
         },
        json: true
    }, function(err, response, body) {
        return cb(err, body);
    });
};

exports.validateShrinkwrap = function(shrinkwrap, cb) {
    request({
        url: 'https://nodesecurity.io/validate/shrinkwrap',
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        json: shrinkwrap
    }, function(err, response, body) {
        return cb(err, body);
    });
};
