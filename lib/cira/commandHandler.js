/*global module, console, process */

module.exports = function ( ) {
	
	var handler = {},
		argv,
		config;
	
	handler.setContext = function ( context ) {
		argv = context.argv;
		config = context.config;
	};
	
	handler.param = function ( key ) {
		return argv[key];
	};
	
	handler.displayHelp = function ( ) {
		
	};
	
	handler.run = function ( ) {
		
	};
	
	handler.getCommand = function ( ) {
		return argv._[0];	
	};
	
	handler.getArgv = function ( ) {
		return argv;
	};
	
	handler.getConfig = function ( ) {
		return config;	
	};
	
	handler.getProject = function ( ) {
		return argv.p || argv.project || config.project;
	};
	
	handler.error = function ( err ) {
		console.error(err);
	};
	
	handler.exit = function ( ) {
		process.exit(0);	
	};
	
	handler.log = function ( ) {
		console.log.apply(console, arguments);
	};
	
	handler.debug = function ( ) {
		if(argv.debug || argv.verbose) {
			handler.log.apply(handler, arguments);
		}	
	};
	
	handler.verbose = function ( ) {
		if(argv.verbose) {
			handler.log.apply(handler, arguments);
		}	
	};
	
	return handler;
	
};
