var celeri = require('celeri');
var nspShrinkwrap = require('nsp-audit-shrinkwrap');
var prettyOutput = require('./../../lib/prettyOutput');
var path = require('path');

// Command Description

celeri.option({
    command: 'audit-shrinkwrap',
    description: 'audits your `npm shrinkwrap` against NSP db'
}, action);

celeri.option({
    command: 'shrinkwrap',
    description: 'alias to audit-shrinkwrap'
}, action);

// Action

function action(data) {
    var shrinkwrapPath = path.resolve(process.cwd(), 'npm-shrinkwrap.json');
    
    nspShrinkwrap.auditByPath(shrinkwrapPath, function (err, results) {
        if (err) { 
            console.error(err);
            process.exit(1);
        }
        prettyOutput(results);
    });
}

// Helpers
