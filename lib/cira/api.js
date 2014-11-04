/*global module,require*/

var jira = require('jira'),
	q = require('q');

module.exports = function ( config )  {
	
	var api = {},
		jiraApi,
		match,
		protocol,
		host,
		port,
		user = config.username,
		password = config.password,
		version = config.version;
		
	match = config.host.match(/^((http|https):\/\/)?(.*?)\/?(:(\d+))?$/);
	
	if(!match) {
		// throw configuration error
	}
	
	protocol = match[1] || 'https';
	host = match[3];
	port = match[5];
	
	jiraApi = new jira.JiraApi(
		protocol,
		host,
		port,
		user,
		password,
		version
	);
	
	api.search = function ( jql, optional ) {
		var deferred = q.defer();
		jiraApi.searchJira(jql, optional, function ( err, result  ) {
			if(err) {
				deferred.reject(err);
			} else {
				deferred.resolve(result);
			}
		});
		
		return deferred.promise;
	};
	
	api.getProject = function ( key ) {
		
		var deferred = q.defer();
		
		jiraApi.getProject(key, function ( err, projObj ) {
			if(err) {
				deferred.reject(err);
			} else {
				deferred.resolve(projObj);
			}
		});
		
		return deferred.promise;
	};
	
	api.getRapidView = function ( project ) {
		var deferred = q.defer();
		
		jiraApi.findRapidView(project, function ( err, result ) {
			if(err) {
				deferred.reject(err);	
			} else {
				deferred.resolve(result.id);
			}
		});
		
		return deferred.promise;
	};
	
	api.getCurrentSprint = function ( rapidview ) {
		var deferred = q.defer();
		
		jiraApi.getLastSprintForRapidView(rapidview, function ( err, result ) {
			if(err || !result) {
				deferred.reject(err || 'Unable to find open sprints');
			} else {
				deferred.resolve(result.id);
			}
		});
		
		return deferred.promise;
	};
	
	api.addToSprint = function ( sprintId, issueId ) {
		var deferred = q.defer();
		
		jiraApi.addIssueToSprint(issueId, sprintId, function ( err/*, data*/ ) {
			if(!err) {
				deferred.resolve();
			} else {
				deferred.reject(err);
			}
		});
		
		return deferred.promise;
	};
	
	
	api.removeFromSprint = function ( issueId ) {
		var deferred = q.defer();
		
		jiraApi.removeIssueFromSprint(issueId, function ( err/*, data*/ ) {
			if(!err) {
				deferred.resolve();
			} else {
				deferred.reject(err);
			}
		});
		
		return deferred.promise;
	};
	
	return api;
	
};
