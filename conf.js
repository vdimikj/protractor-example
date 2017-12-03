// solves `SyntaxError: Unexpected token import`
require("babel-register")({
    presets: [ 'es2015' ]
});
const fs = require('fs');
const FancyReporter = require('fancy-protractor-reporter').Reporter;

const fancyReporter = new FancyReporter({
    path: 'report/fancy' + new Date().toISOString().substring(0,19),
    screenshotOnPassed: true,
    consolidateAll: true,
    // isSharded: true
});

exports.config = {
    /**
     *  Uncomment ONE of the following to connect to: seleniumServerJar OR directConnect. Protractor
     *  will auto-start selenium if you uncomment the jar, or connect directly to chrome/firefox
     *  if you uncomment directConnect.
     */
    //seleniumServerJar: "node_modules/protractor/node_modules/webdriver-manager/selenium/selenium-server-standalone-3.4.0.jar",
    directConnect: true,

    specs: ['specs/*Spec.js'],
    baseUrl: 'http://qualityshepherd.com',
    framework: 'jasmine',

    onPrepare: () => {
        // set browser size...
        browser.manage().window().setSize(1024, 800);

        if (!fs.existsSync('report')) {
                    fs.mkdirSync('report');
        }

        // better jasmine 2 reports...
        const SpecReporter = require('jasmine-spec-reporter');
        jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace: 'specs'}));
        jasmine.getEnv().addReporter(fancyReporter);
    },
    afterLaunch: () => {
        fancyReporter.combineReports();
    },

    capabilities: {
        browserName: 'chrome',
        shardTestFiles: false,
        maxInstances: 1
        // chromeOptions: {
        //     args: [
        //         // disable chrome's wakiness
        //         '--disable-infobars',
        //         '--disable-extensions',
        //         'verbose',
        //         'log-path=/tmp/chromedriver.log'
        //     ],
        //     prefs: {
        //         // disable chrome's annoying password manager
        //         'profile.password_manager_enabled': false,
        //         'credentials_enable_service': false,
        //         'password_manager_enabled': false
        //     }
        // }
    },

    jasmineNodeOpts: {
        showColors: true,
        displaySpecDuration: true,
        // overrides jasmine's print method to report dot syntax for custom reports
        print: () => {},
        defaultTimeoutInterval: 50000
    }
};