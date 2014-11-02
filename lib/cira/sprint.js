/*global require, module, console*/

var handler = require('./commandHandler'),
	_ = require('lodash'),
	q = require('q'),
	yesno = require('yesno'),
	print = require('./print'),
	util = require('./util'),
	string = require('string');

module.exports = function ( api ) {
	
	var sprint = _.extend({}, handler());
	
	function updateProjectCache ( project ) {
		var deferred = q.defer(),
			cache = {};
			
		sprint.verbose('Updating project cache');
		
		q.all([
			getRapidView(project)
				.then(function ( rapidview ) {
					cache.rapidViewId = rapidview;	
				}),
			getSprintFieldId(project)
				.then(function ( sprintFieldId ) {
					cache.sprintFieldId = sprintFieldId;	
				})
		])
			.then(function ( ) {
				var config = sprint.getConfig(),
					projectCache = config.projectCache || {};
					
				sprint.verbose('Project cache updated', projectCache);
					
				projectCache[project] = cache;
					
				deferred.resolve(cache);
				
				util.setConfigValues( { projectCache:  projectCache } );
				
			})
			.catch(function ( ) {
				deferred.reject('Failed to update the project cache.');
			});
		
		
		return deferred.promise;
	}
	
	function getProjectCache ( ) {
		var deferred = q.defer(),
			config = sprint.getConfig(),
			project = sprint.getProject();
			
		sprint.verbose('Getting project cache');
		
		if(config.projectCache && config.projectCache[project]) {
			sprint.verbose('Cache already exists');
			deferred.resolve(config.projectCache[project]);
		} else {
			updateProjectCache(project)
				.then(function ( cache ) {
					deferred.resolve(cache);
				})
				.catch(function ( err ) {
					deferred.reject(err);
				});
		}
		
		return deferred.promise;
	}
	
	function getSprintFieldId ( ) {
		var deferred = q.defer();
		
		sprint.verbose('Getting sprint field ID');
		
		api.search('ORDER BY key DESC', { maxResults: 1 })
			.then(function ( result ) {
				var issue = result.issues[0];
				
				sprint.verbose('getSprintFieldId, last issue: ', issue.key);
				
				if(!issue) {
					deferred.reject('No issues, can\'t resolve sprint field id');
				} else {
					api.getEditMetadata(issue.key)
						.then(function ( metadata ) {
							
							var sprintField = _.find(metadata.fields, { name: 'Sprint' });
							
							sprint.verbose('getSprintFieldId, issue metadata:', sprintField);
							
							if(!sprintField) {
								deferred.reject('No sprint field was found');
							} else {
								deferred.resolve(sprintField.schema.customId);
							}
						})
						.catch(function ( err ) {
							
							sprint.verbose('getSprintFieldId, metadata failed:', err);
							
							deferred.reject('Failed to get issue metadata');
						});
				}
			})
			.catch(function ( err ) {
				deferred.reject('Could not resolve sprint field id: ' + err);
			});
			
		return deferred.promise;
	}
	
	function getRapidView ( ) {
		var deferred = q.defer(),
			project = sprint.getProject();
			
		sprint.verbose('Getting rapid view for project ' + project);
			
		api.getProject(project)
			.then(function ( projObj ) {
				api.getRapidView(projObj.name)
					.then(function ( rapidview ) {
						sprint.verbose('Rapidview for project ' + project + ' is ' + rapidview);
						deferred.resolve(rapidview);
					})
					.catch(function ( err ) {
						sprint.debug('Error getting rapidview for project ' + project + ': ' + err);
						deferred.reject(err);
					});
			})
			.catch(function ( err ) {
				deferred.reject(err);
			});
	
		return deferred.promise;
	}
	
	function getCurrentSprint ( ) {
		var deferred = q.defer();
		
		sprint.verbose('Getting current sprint');
		
		getRapidView()
			.then(function ( rapidViewId ) {
				api.getCurrentSprint(rapidViewId)
					.then(function ( sprintId ) {
						
						sprint.verbose('Sprint id: ' + sprintId);
						
						deferred.resolve(sprintId);
					})
					.catch(function ( err ) {
						deferred.reject('Could not resolve current sprint: ' + err);
					});
			})
			.catch(function ( err ) {
				deferred.reject(err);
			});
			
		return deferred.promise;
	}
	
	function listUserIssues ( ) {
		var mine = sprint.param('mine') || sprint.param('m'),
			open = sprint.param('open') || sprint.param('o'),
			sort = sprint.param('sort') || sprint.param('s'),
			reverse = sprint.param('reverse') || sprint.param('r'),
			jql = 'sprint in openSprints()';
			
		if(mine) {
			jql += ' AND assignee = currentUser()';
		}
		
		if(open) {
			jql += ' AND resolution IS EMPTY';
		}
		
		if(sort) {
			jql += ' ORDER BY ' + sort;
			if(reverse) {
				jql += ' DESC';
			}
		}
		
		api.search(jql)
			.then(function ( result ) {
				
				print.issues(result.issues);
			})
			['catch'](function ( error ) {
				console.error(error);
			});
		
	}
	
	function updateIssuesSprint ( isAdd ) {
		var issues = _.uniq(_.rest(sprint.getArgv()._)),
			project = sprint.getProject(),
			promises = [],
			sprintId,
			verb,
			prep,
			simple;
			
		if(isAdd) {
			promises.push(
				getCurrentSprint().then(function ( id ) {
					sprintId = id;
				}));
			verb = 'add';
			prep = 'to';
			simple = 'added';
		} else {
			verb = 'remove';
			prep = 'from';
			simple = 'removed';
		}
		
			
		function commit ( ids ) {
			
			q.all(promises).then(function ( ) {
				q.all(_.map(ids, function ( issueId ) {
					
					var promise;
					
					if(isAdd) {
						promise = api.addToSprint(sprintId, issueId);
					} else {
						promise = api.removeFromSprint(issueId);
					}
					
					return promise
						.then(function ( ) {
							sprint.debug(string(simple).capitalize() + ' ' + issueId + ' ' + prep + ' sprint ' + sprintId);
						})
						.catch(function ( err ) {
							sprint.error(err);
						});
				}))
					.then(function ( ) {
						sprint.log(string(simple).capitalize() + ' ' + prep + ' sprint: ' + ids.join(','));
					})
					.catch(function ( ) {
						sprint.error('Could not ' + verb + ' all issues ' + prep + ' sprint');
					})
					.finally(function ( ) {
						sprint.exit();
					});
			});
		}
			
		if(project) {
			issues = _.map(issues, function ( id ) {
				return project + '-' + id;
			});
		}
		
		api.search('key in (' + issues.join(',') + ') ')
          	.then(function ( result ) {
          		print.issues(result.issues);
          		yesno.ask('Do you want to ' + verb + ' these issues ' + prep + ' the current sprint?', true, function ( ok ) {
          			if(ok) {
          				commit(_.pluck(result.issues, 'key'));
          			} else {
          				sprint.exit();
          			}
          		});
          	})
          	.catch(function ( err ) {
          		console.error(err.stack);
          	});
		
	}

	function addIssues ( ) {
		updateIssuesSprint(true);
	}
	
	function removeIssues ( ) {
		updateIssuesSprint(false);
	}
		
	sprint.run = function ( ) {
		var command = sprint.getCommand();
		sprint.verbose('Running command ' + command);
		switch(command) {
			default:
			case 'list':
			listUserIssues();
			break;
			
			case 'add':
			addIssues();
			break;
			
			case 'remove':
			removeIssues();
			break;
		}
	};
	
	return sprint;
	
};
