#!/usr/bin/env node

var celeri = require('celeri');
var speller = require('speller');
require('./../commands');

var commands = ['package',
                'audit-package',
                'shrinkwrap',
                'audit-shrinkwrap',
                'version'];

celeri.parse(process.argv, function(err, cmd) {
    if (err) {
        console.error(err);
        process.exit(1);
    }

    var command = cmd.command[0];

    if (commands.indexOf(command) === -1) {
        speller.train(commands.join(' '));
        var corrected = speller.correct(command);

        if (corrected === command) {
            console.error('Unknown command "' + command + '". Did you mean:');
            for (var i = 0; i < commands.length; i++) {
                console.error('- ' + commands[i]);
            }
        } else {
            console.error('Unknown command "' + command +
                          '". Did you mean "' + corrected + '"?');
        }
    }
});
