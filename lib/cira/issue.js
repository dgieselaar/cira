/*global module, require*/

var commandHandler = require('./commandHandler'),
	_ = require('lodash'),
	print = require('./print');

module.exports = function ( api ) {
	
	var handler = commandHandler(),
		issue = _.assign({}, handler);
	
	function show ( keys ) {
		
		api.search('key in (' + keys.join(', ') + ')', { fields: [ '*all' ] })
			.then(function ( result ) {
				print.issueExpanded(result.issues);
				handler.exit();
			})
			.catch(function ( err ) {
				handler.error(err);
				handler.exit();
			});
	}
	
	function transition ( keys ) {
		
	}
	
	function start ( keys ) {
		
	}
	
	function stop ( keys ) {
		
	}
	
	issue.run = function ( ) {
		
		var command = handler.getCommand(),
			list = _.uniq(_.rest(handler.getArgv()._)),
			project = handler.getProject();
		
		if([ 'show', 'transition', 'start', 'list'].indexOf(command) === -1) {
			list.unshift(command);
			command = 'show';
		}
		
		if(list.length === 0) {
			handler.error('No issues given');
		}
			
		list = list.map(function ( id ) {
			return project + '-' + id;
		});
			
		switch(command) {
			case 'show':
			show(list);
			break;
			
			case 'transition':
			transition(list);
			break;
			
			case 'start':
			start(list);
			break;
			
			case 'stop':
			stop(list);
			break;
		}
		
	};
	
	return issue;
	
};
