'use strict';

const agent = require('../classes/agentClass.js');

module.exports = function builders() {
    return agent.disconnectAll(null);
};
