const EXCLUDED = [
    "sgtoddball1975",
    "erupharm1975",
    "generalgeorgespatton1975",
    "cavetrol1975"
];

var exclude = function (test) {
    return EXCLUDED.some(
        item => item.toLowerCase() === test.toLowerCase()
    );
};