'use strict';

const util = require('util');

function defineError(superclass, constructor) {
    var name = constructor.name;
    util.inherits(constructor, superclass);
    constructor.prototype.name = name;
    exports[name] = constructor;
    return constructor;
}

var HTTPError = defineError(Error, function HTTPError(code, message) {
    this.message = message;
    this.status = code;
});

var BadRequest = defineError(HTTPError, function BadRequest(message) { // jshint ignore:line
    HTTPError.call(this, 400, message);
});

var Unauthorized = defineError(HTTPError, function Unauthorized(message) { // jshint ignore:line
    HTTPError.call(this, 401, message);
});

var Forbidden = defineError(HTTPError, function Forbidden(message) { // jshint ignore:line
    HTTPError.call(this, 403, message);
});

var NotFound = defineError(HTTPError, function NotFound(message) { // jshint ignore:line
    HTTPError.call(this, 404, message);
});

var Conflict = defineError(HTTPError, function Conflict(message) { // jshint ignore:line
    HTTPError.call(this, 409, message);
});

var Internal = defineError(HTTPError, function Internal(message) { // jshint ignore:line
    HTTPError.call(this, 500, message);
});

var ServiceUnavailable = defineError(HTTPError, function ServiceUnavailable(message) {
    HTTPError.call(this, 503, message);
});

var CouchDBUnavailable = defineError(ServiceUnavailable, function CouchDBUnavailable() { // jshint ignore:line
    ServiceUnavailable.call(this, 'Could not perform request because the database is unavailable.');
});

var OpenDirectoryBusy = defineError(HTTPError, function OpenDirectoryBusy() { // jshint ignore:line
    HTTPError.call(this, 531, 'The server is updating its user access control list. Please try again later.');
});