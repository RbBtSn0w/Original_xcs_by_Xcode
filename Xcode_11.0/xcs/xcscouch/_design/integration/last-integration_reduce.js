function(key, values) {
    var max = -Infinity;
    for (var i = 0; i < values.length; i++) if (typeof values[i] == 'number') {
        max = Math.max(values[i], max);
    }
    return max;
}
