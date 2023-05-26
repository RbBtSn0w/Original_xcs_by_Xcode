'use strict';

module.exports = {
    'qs@0.5.x': [{
        'title': 'qs Denial-of-Service Extended Event Loop Blocking',
        'author': 'Tom Steele',
        'module_name': 'qs',
        'publish_date': 'Aug 6 2014 09:10:23 GMT-0800 (PST)',
        'cves': [],
        'vulnerable_versions': '<1.0.0',
        'patched_versions': '>= 1.x',
        'url': 'qs_dos_extended_event_loop_blocking'
    }, {
        'title': 'qs Denial-of-Service Memory Exhaustion',
        'author': 'Dustin Shiver',
        'module_name': 'qs',
        'publish_date': 'Aug 6 2014 09:10:22 GMT-0800 (PST)',
        'cves': [],
        'vulnerable_versions': '<1.0.0',
        'patched_versions': '>= 1.x',
        'url': 'qs_dos_memory_exhaustion'
    }],
    'qsVulnerabilityResponse': [{
        module: 'qs',
        version: '2.3.3',
        advisory: {
            title: 'qs Denial-of-Service Extended Event Loop Blocking',
            author: 'Tom Steele',
            module_name: 'qs',
            publish_date: 'Aug 6 2014 09:10:23 GMT-0800 (PST)',
            cves: [],
            vulnerable_versions: '<1.0.0',
            patched_versions: '>= 1.x',
            url: 'qs_dos_extended_event_loop_blocking'
        },
        dependencyOf: ['test@0.0.1', 'request@2.49.0', 'qs@2.3.3']
    }, {
        module: 'qs',
        version: '0.5.6',
        advisory: {
            title: 'qs Denial-of-Service Extended Event Loop Blocking',
            author: 'Tom Steele',
            module_name: 'qs',
            publish_date: 'Aug 6 2014 09:10:23 GMT-0800 (PST)',
            cves: [],
            vulnerable_versions: '<1.0.0',
            patched_versions: '>= 1.x',
            url: 'qs_dos_extended_event_loop_blocking'
        },
        dependencyOf: ['test@0.0.1', 'qs@0.5.6']
    }]
};
