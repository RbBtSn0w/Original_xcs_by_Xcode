var table = require('text-table');
var chalk = require('chalk');

exports = module.exports = prettyOutput;

function prettyOutput(result) {
    if (result && result.length > 0) {
        // Pretty output
        var opts = {
            align: ['l', 'c', 'c', 'l'],
            stringLength: function(s) {
                return chalk.stripColor(s).length;
            }
        };
        var h = [
            [
                chalk.underline('Name'),
                chalk.underline('Installed'),
                chalk.underline('Patched'),
                chalk.underline('Vulnerable Dependency')
            ]
        ];

        result.forEach(function(module) {
            h.push([
                module.module,
                module.version,                   /* jscs:disable */
                module.advisory.patched_versions,
                module.dependencyOf.join(' > ')   /* jscs:enable */
            ]);
        });
        var t = table(h, opts);
        console.error(t);
        process.exit(1);
    } else {
        console.log(chalk.green('No vulnerable modules found'));
        process.exit(0);
    }
}
