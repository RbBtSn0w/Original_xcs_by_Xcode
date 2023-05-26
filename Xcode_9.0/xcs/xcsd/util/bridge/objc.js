'use strict';

var $ = require('nodobjc');
$.import('Foundation');

var k = require('../../constants.js'),
    logger,
    Errors = require('../error.js');

function importSharedFramework(name) {
    $.import(k.XCSXcodeFrameworksPath + '/' + name + '.framework');
}

function convertToNSObject(jsonData) {
    if (!(typeof (jsonData) === 'string' || Buffer.isBuffer(jsonData))) {
        jsonData = JSON.stringify(jsonData);
    }

    jsonData = new Buffer(jsonData);
    var objectData = $(jsonData);

    var errorRef = $.alloc($.NSError).ref();
    var jsonDict = $.NSJSONSerialization('JSONObjectWithData', objectData, 'options', $.NSJSONReadingMutableContainers, 'error', errorRef);
    if (!jsonDict) {
        var error = errorRef.deref();
        logger.error('Could convert JSON object to NSDictionary:', error('localizedDescription')('UTF8String'));
        return null;
    }

    return jsonDict;
}

function convertToJSONObject(dictionary) {
    if (dictionary('isKindOfClass', $.XCSObject)) {
        dictionary = dictionary('dictionaryRepresentation');
    }

    var errorRef = $.alloc($.NSError).ref();
    var jsonData = $.NSJSONSerialization('dataWithJSONObject', dictionary, 'options', 0, 'error', errorRef);
    if (!jsonData) {
        var error = errorRef.deref();
        logger.error('Could not convert NSDictionary to JSON data:', error('localizedDescription')('UTF8String'));
        return null;
    }

    var jsonString = $.NSString('alloc')('initWithData', jsonData, 'encoding', $.NSUTF8StringEncoding);
    if (!jsonString) {
        logger.error('Could not convert JSON data to string.');
        return null;
    }

    return JSON.parse(jsonString('UTF8String'));
}

function convertErrorToJSONObject(error) {
    return {
        code: error('code'),
        domain: error('domain')('UTF8String'),
        message: error('localizedDescription')('UTF8String')
    };
}

function indexedForEach(collection, fn) {
    if (collection) {
        var count = collection('count');
        for (var i = 0; i < count; i++) {
            var obj = collection('objectAtIndex', i);
            fn(obj, i);
        }
    }
}

function keyedForEach(collection, fn) {
    if (collection) {
        var keyEnumerator = collection('keyEnumerator');
        var key;

        while ((key = keyEnumerator('nextObject'))) {
            var obj = collection('objectForKey', key);
            fn(obj, key);
        }
    }
}

function tryError(objectOrFunction) {
    if (arguments.length <= 2) {
        throw new Error('tryError expects at least an object/function and a callback, with optional arguments in-between');
    }

    var callback = arguments[arguments.length - 1],
        args = Array.prototype.slice.call(arguments, 1, -1);

    var errorRef = $.alloc($.NSError).ref();
    args.push(errorRef);

    var result = objectOrFunction.apply(objectOrFunction, args);
    if (!result) {
        var error = errorRef.deref();
        callback(error);
    } else {
        callback(null, result);
    }
}

function exception(e) {
    if (typeof e === 'function') {
        logger.error('Caught NSException from Objective-C:', e('name'), e('reason'), e('callStackSymbols'));
        return new Errors.Internal(e.message);
    } else {
        return e;
    }
}

module.exports = {
    "$": $,
    "importSharedFramework": importSharedFramework,
    "convertToNSObject": convertToNSObject,
    "convertToJSONObject": convertToJSONObject,
    "convertErrorToJSONObject": convertErrorToJSONObject,
    "indexedForEach": indexedForEach,
    "keyedForEach": keyedForEach,
    "tryError": tryError,
    "exception": exception
};

logger = require('../logger.js');
