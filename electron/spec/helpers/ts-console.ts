import { TSConsoleReporter } from 'jasmine-ts-console-reporter';

jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(new TSConsoleReporter());
