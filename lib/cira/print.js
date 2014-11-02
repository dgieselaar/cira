var chalk = require('chalk'),
	_ = require('lodash'),
	format = require('./format');

module.exports = (function ( ) {
	
	var defaults = {
			issues: chalk.green('%(key)s') + ': %(summary)-60.60s  ' + chalk.yellow('%(status.name)-10.10s') + chalk.cyan('%(assignee.name)s')
		};
	
	return { 
		issues: function ( issues, template ) {
			
			var output;
			
			if(!template) {
				template = defaults.issues;
			}
			
			output = _.map(issues, function ( issue ) {
				
				var obj = _.extend(issue, issue.fields),
					res;
					
				res = format(obj, template);
				
				return res;
			}).join('\r\n');
			
			if(!output) {
				output = 'No issues found';
			}
			
			console.log(output);
			
			
		}
	};
	
})();
