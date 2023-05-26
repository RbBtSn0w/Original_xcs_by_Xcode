var validateModule = require('nsp-api').validateModule;
var path = require('path');
var fs = require('fs');
var RegClient = require('silent-npm-registry-client');
var npmconf = require('npmconf');
var semver = require('semver');
var async = require('async');

var MAX_ASYNC_THROTTLING = 20;

exports = module.exports = auditPackage;

function auditPackage(pkgPath, cb) {
    var pkg;
    var registry;

    fs.exists(pkgPath, fileExists);

    function fileExists(exists) {
        if (!exists) {
            return cb(new Error('Can\'t load ' + pkgPath +
                        '\nMake sure you have a package.json available'),
                      null);
        }

        try {
            pkg = JSON.parse(fs.readFileSync(pkgPath));
        } catch (e) {
            return cb(e);
        }

        npmconf.load(npmConfLoaded);

        function npmConfLoaded(err, config) {
            if (err) {
                return cb(err);
            }
            registry = new RegClient(config);
            filterPackage(pkg, vulnerable, returnResults);
        }

        function getAncestry(module, list) {
            list = list || [];
            if (!module) {
                return list;
            }
            list.push(module);
            return getAncestry(module.parent, list);
        }

        function vulnerable(module, cb) {
            validateModule(module.name, module.version, function(err, result) {
                if (err) {
                    return cb(err, null);
                }

                if (!Array.isArray(result)) {
                    return cb(new TypeError('Unexpected API response format.'),
                                            null);
                }

                // no advisory found
                if (!result.length) {
                    return cb(null, null);
                }

                var dependencyOf = getAncestry(module);
                dependencyOf = dependencyOf.map(function(d) {
                    return d.name + '@' + d.version;
                });

                var d = {
                    module: module.name,
                    version: module.version,
                    advisory: result[0],
                    dependencyOf: dependencyOf.reverse()
                };
                cb(null, d);
            });
        }

        function returnResults(err, results) {
            if (err) {
                return cb(err, null);
            }
            cb(null, results);
        }
    }

    function filterPackage(pkinfo, fn, cb) {
        return mapPackage(pkinfo, function(x, cb2) {
            fn(x, function(err, res) {
                if (err || !res) { return cb2(null, []); }
                return cb2(null, [res]);
            });
        }, function(err, root, dependencies) {
            if (err) { return cb(err); }
            var res = [];
            if (root) { res.push(root); }
            res = Array.prototype.concat.apply([], dependencies.concat(res));
            cb(null, res);
        });
    }

    function isGitDependency(dependencyVersion) {
        var gitPrefixBlacklist = ['git:',
                                  'git+ssh:',
                                  'https:',
                                  'git+https:'];

        var blacklisted = gitPrefixBlacklist.filter(function(prefix) {
            return dependencyVersion.indexOf(prefix) === 0;
        });

        var slashes = dependencyVersion.match(/\//g);
        var shortUrl = slashes ? slashes.length === 1 : false;

        return !!blacklisted.length || shortUrl;
    }

    function isLocalDependency(dependencyVersion) {
        return dependencyVersion.indexOf('file:') === 0;
    }

    // Prevent loops
    var processed = {};

    function mapPackage(pkginfo, fn, cb) {
        processed[pkginfo.name + '@' + pkginfo.version] = true;
        var dependencies =
            (pkginfo.dependencies && Object.keys(pkginfo.dependencies)) || [];

        async.mapLimit(dependencies, MAX_ASYNC_THROTTLING,
            function(dependencyName, cb2) {

            var dependencyVersion = pkginfo.dependencies[dependencyName];

            if (dependencyVersion === 'latest') {
                dependencyVersion = '*';
            }

            // Ignore git dependencies
            if (isGitDependency(dependencyVersion)) {
                console.warn('Warning: Git dependency ['  +
                    dependencyName + '@' + dependencyVersion + '] ignored.');
                return cb2(null);
            }

            if (isLocalDependency(dependencyVersion)) {
                console.warn('Warning: Local dependency [' +
                    dependencyName + '@' + dependencyVersion + '] ignored.');
                return cb2(null);
            }

            registry.get(dependencyName, dependencyVersion,
                function(err, dependencyPkginfo) {

                if (err) {
                    console.warn('Warning: ' + err);
                    return cb2();
                }
                if (!dependencyPkginfo || !dependencyPkginfo.versions) {
                    return cb2(null);
                }

                var ver = semver
                    .maxSatisfying(Object.keys(dependencyPkginfo.versions),
                                               dependencyVersion);

                if (!dependencyPkginfo.versions[ver]) {
                    console.warn('Error processing: [' +
                                 dependencyPkginfo.name + '@' +
                                 dependencyPkginfo.version + '] ignored.');
                    return cb2(null);
                }

                // Get the matched version
                dependencyPkginfo = dependencyPkginfo.versions[ver];
                dependencyPkginfo.parent = pkginfo;
                if (processed[dependencyPkginfo.name + '@' +
                        dependencyPkginfo.version]) {
                    return cb2(null);
                }

                mapPackage(dependencyPkginfo, fn,
                    function(err, rootResult, mappedDependencies) {

                    if (err) {
                        return cb(err);
                    }
                    var res = [];
                    if (rootResult) {
                        res.push(rootResult);
                    }
                    cb2(null, res.concat(mappedDependencies));
                });
            });
        }, function(err, mappedDependencies) {
            mappedDependencies = Array
                                    .prototype
                                    .concat
                                    .apply([], mappedDependencies);
            // remove undefined / null from ignored packages
            mappedDependencies = mappedDependencies
                                    .filter(function(dependency) {
                return dependency;
            });

            if (err) {
                return cb(err);
            }

            fn(pkginfo, function(err, rootResult) {
                if (err) {
                    return cb(err);
                }
                cb(null, rootResult, mappedDependencies);
            });
        });
    }
}
