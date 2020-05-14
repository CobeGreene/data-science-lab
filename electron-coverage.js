const Jasmine = require('jasmine');
var jasmine = new Jasmine();
jasmine.showColors(true);
jasmine.loadConfigFile('./electron/spec/support/jasmine.json')
jasmine.execute();