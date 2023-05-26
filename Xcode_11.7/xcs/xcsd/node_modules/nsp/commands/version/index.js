var celeri = require('celeri');

celeri.option({
    command: 'version',
    description: 'shows the current version of nsp'
}, action);

function action(data) {
    var self = require('./../../package.json');
    console.log(self.version);
}
