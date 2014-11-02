/*global require,module*/

var prompt = require('prompt'),
	_ = require('lodash'),
	q = require('q'),
	fs = require('fs');

module.exports = (function ( ) {
	
	var configPath = './.cira';
	
	function readConfig ( ) {
		var deferred = q.defer();
		
		fs.readFile(configPath, { flag: 'a+', encoding: 'utf8' }, function ( err, data ) {
			
			var config;
			
			if(err) {
				deferred.reject(err);
			} else {
				try {
					config = JSON.parse(data);	
					deferred.resolve(config);
				} catch ( error ) {
					deferred.reject(err);
				}
			}
			
		});
		
		return deferred.promise;
	}
	
	function writeConfig ( config ) {
		
		var deferred = q.defer();
		
		fs.writeFile(configPath, JSON.stringify(config), function ( err/*, data*/ ) {
			if(err) {
				deferred.reject(err);
			} else {
				deferred.resolve(config);
			}
		});
		
		return deferred.promise;
	}
	
	function setConfigValues ( params ) {
		var deferred = q.defer();
		
		readConfig()
			.then(function ( config ) {
				writeConfig(_.assign(config, params))
					.then(function ( cfg ) {
						deferred.resolve(cfg);
					})
					.catch(function ( err ) {
						deferred.reject(err);
					});
			});
			
		return deferred.promise;
	}
	
	function runWizard ( ) {
		
		var deferred = q.defer(),
			hostPattern = /((http|https):\/\/)?(.*?)\/?(:\d+)?/;
		
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
				project: {
					description: 'The key of your default project',
					type: 'string'
				},
				version: {
					description: 'The version of the JIRA API you are using (defaults to 2)',
					type: 'string',
					required: false,
					default: '2'
				}
			}
		}, function ( err, result ) {
			
			if(result) {
				
				writeConfig(result)
					.then(function ( config ) {
						deferred.resolve(config);
					})
					.catch(function ( error ) {
						deferred.reject(error);
					});
			} else {
				deferred.reject(err);
			}
			
		});
		
		return deferred.promise;
		
	}
	
	return {
		readConfig: readConfig,
		writeConfig: writeConfig,
		setConfigValues: setConfigValues,
		runWizard: runWizard
	};
	
})();
