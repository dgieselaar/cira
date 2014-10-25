var fs = require('fs'),
	_ = require('lodash'),
	prompt = require('prompt');

module.exports = function ( argv ) {
	
	var configPath = './.cira';
	
	fs.readFile(configPath, { flag: 'a+', encoding: 'utf8' }, function ( err, data ) {
		var config,	
			empty;
		
		function run ( ) {
			empty = _.pick(config, 'username', 'password', 'url');	
		}
		
		try {
			config = JSON.parse(data);
			run(config);
		} catch ( error ) {
			configure(function ( cnfg ) {
				run(cnfg);
			});
		}
		
		
		
		
	});
		
	function configure ( callback ) {
		
		var hostPattern = /((http|https):\/\/)?(.*?)\/?(:\d+)?/;
		
		prompt.start();
		
		prompt.get({
			properties: {
				username: {
					description: 'The username for your Atlassian account',
					type: 'string',
					required: true
				},
				password: {
					description: 'The password for your Atlassian account',
					type: 'string',
					required: true,
					hidden: true
				},
				host: {
					description: 'The full URL, including protocol (defaults to https) and port number (defaults to 80)',
					type: 'string',
					pattern: hostPattern,
					required: true
				},
				version: {
					description: 'The version of the JIRA API you are using (defaults to 2.0alpha1)',
					type: 'string',
					required: false,
					default: '2.0alpha1'
				}
			}
		}, function ( err, result ) {
			
			if(result) {
				
				fs.writeFile(configPath, JSON.stringify(result), function ( ) {
					// log if verbose
				});
				
				callback(result);
			}
			
		});
		
		
		
	}
		
	return {
		configure: configure
	};
	
	
};
