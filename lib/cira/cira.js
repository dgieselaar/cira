/*global require,module,console*/

var runner = require('./runner'),
	util = require('./util');

module.exports = (function ( ) {
	
	function run ( argv ) {
		
		if(argv._[0] === 'configure') {
			util.runWizard();
			return;
		}
		
		function jitWizard ( ) {
			util.runWizard()
				.then(function ( config ) {
					runner(argv, config);
				})
				.catch(function ( /*cnfg*/ ) {
					console.log('Error running configuration wizard. Please try again.');
				});
		}
		
		util.readConfig()
			.then(function ( config ) {
				try {
					runner(argv, config);
				} catch ( err ) {
					console.error(err);
				}
			})
			.catch(function ( err ) {
				console.log('No valid configuration found. Running the configuration wizard...');
				jitWizard();
			});
		
	}
		
	return {
		run: run
	};
	
	
})();
