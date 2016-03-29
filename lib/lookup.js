'use strict';

var fs = require('fs');
var path = require('path');

module.exports.sync = lookupSync;
module.exports.allSync = lookupAllSync;

function lookupSync(dirs, search) {
    if (typeof search === 'function') {
        return lookupFuncSync(dirs, search);
    } else {
        return lookupPathSync(dirs, search);
    }
}

function lookupAllSync(dirs, search) {
    if (typeof search === 'function') {
        return lookupFuncAllSync(dirs, search);
    } else {
        return lookupPathAllSync(dirs, search);
    }
}

function lookupPathSync(dirs_, search) {
    var dirs = dirs_.split(path.delimiter);
    var i = -1;
    var l = dirs.length;

    while (++i < l) {
        let dir = dirs[i];

        var segments = path.resolve(dir).split(path.sep);

        while(segments.length) {
            let needle = path.join('/', ...segments, search);

            if (fs.existsSync(needle)) {
                return needle;
            }

            segments.pop();
        }
    }
}

function lookupFuncSync(dirs_, fn) {
    var dirs = dirs_.split(path.delimiter);
    var i = -1;
    var l = dirs.length;

    while (++i < l) {
        let dir = dirs[i];

        var segments = path.resolve(dir).split(path.sep);

        while(segments.length) {
            let needle = fn(path.join(...segments));
            if (needle) {
                return path.join(segments, needle);
            }
            segments.pop();
        }
    }
}

function lookupPathAllSync(dirs_, search) {
    var dirs = dirs_.split(path.delimiter);
    var i = -1;
    var l = dirs.length;

    var result = [];

    while (++i < l) {
        let dir = dirs[i];

        var segments = path.resolve(dir).split(path.sep);

        while(segments.length) {
            let needle = path.join('/', ...segments, search);

            if (fs.existsSync(needle)) {
                result.push(needle);
            }

            segments.pop();
        }
    }

    return result;
}

function lookupFuncAllSync(dirs_, fn) {
    var dirs = dirs_.split(path.delimiter);
    var i = -1;
    var l = dirs.length;
    var result = [];

    while (++i < l) {
        let dir = dirs[i];

        var segments = path.resolve(dir).split(path.sep);

        while(segments.length) {
            let needle = fn(path.join(...segments));
            if (needle) {
                resul.push(path.join(segments, needle));
            }
            segments.pop();
        }
    }

    return result;
}
