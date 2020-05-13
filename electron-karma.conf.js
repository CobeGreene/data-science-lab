module.exports = function (config) {
    config.set({
        frameworks: ["jasmine", "karma-typescript"],

        files: [
            { pattern: "electron/**/*.ts" },
        ],

        preprocessors: {
            "**/*.ts": ["karma-typescript"]
        },
        client: {
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },

        reporters: ["progress", "karma-typescript", "coverage", "kjhtml"],
        browsers: ["Chrome"]
    });
};