module.exports = function(fn) {
    if (typeof fn !== 'function') {
        return [];
    }

    var str = fn.toString();

    var match = str.match(/^(function\s*)?(\w+)\s*\(([^)]+)\)/i);
    var args;
    if (match) {
        args = match[3];
    } else if (match = str.match(/^\(([^)]+)\)\s=>/)) {
        args = match[1];
    }

    return args
        ? args.split(/\s*,\s*/).map(arg => arg.trim())
        : [];
};
