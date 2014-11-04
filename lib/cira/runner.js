/*global require, module*/

var sprint = require('./sprint'),
	issue = require('./issue'),
	api = require('./api');

module.exports = function ( argv, config ) {
	
	var command = argv._.shift(),
		cls,
		jira;
		
	function displayCommandNotFound ( ) {
		
	}
	
	function runHandler ( handler ) {
		
		handler.setContext({
			argv: argv,
			config: config
		});
		
		if(command.h || command.help) {
			handler.showHelp();
		} else {
			handler.run();
		}
	}
	
	switch(command) {
		case 'sprint':
		cls = sprint;
		break;
		
		case 'issue':
		cls = issue;
		break;
	}
	
	if(!cls) {
		displayCommandNotFound();
	} else {
		jira = api(config);
		runHandler(cls(jira));
	}
	
};
