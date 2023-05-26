'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

module.exports = function routes(app) {

    require('./routes_misc.js')(app);
    require('./routes_health.js')(app);
    require('./routes_auth.js')(app);
    require('./routes_database.js')(app);
    require('./routes_bot.js')(app);
    require('./routes_scm.js')(app);
    require('./routes_user.js')(app);
    require('./routes_integration.js')(app);
    require('./routes_issue.js')(app);
    require('./routes_notification.js')(app);
    require('./routes_file.js')(app);
    require('./routes_device.js')(app);
    require('./routes_platform.js')(app);
    require('./routes_acl.js')(app);
    require('./routes_version.js')(app);
    require('./routes_setting.js')(app);
    require('./routes_portal.js')(app);
    require('./routes_repository.js')(app);
    require('./routes_code_coverage.js')(app);
    require('./routes_dashboard.js')(app);
    require('./routes_debug.js')(app);

};