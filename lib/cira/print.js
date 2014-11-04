/*global require,module*/

var chalk = require('chalk'),
	_ = require('lodash'),
	format = require('./format'),
	table = require('./table'),
	wrap = require('word-wrap');

module.exports = (function ( ) {
	
	var defaults = {
			issue: [
				{
					name: 'key',
					label: 'Key',
					color: chalk.bold.magenta
				},
				{
					name: 'summary',
					label: 'Summary',
					color: chalk.reset
				},
				{
					name: 'status.name',
					label: 'Status',
					color: chalk.bold.yellow
				},
				{
					name: 'assignee.name',
					label: 'Assignee',
					color: chalk.bold.cyan
				}
			],
			issueExpanded: [
				{
					name: 'issuetype.name',
					label: 'Type',
				},
				{
					name: 'priority.name',
					label: 'Priority'
				},
				{
					name: 'description',
					label: 'Description'
				},
				{
					name: 'reporter.name',
					label: 'Reporter'
				},
				{
					name: 'created',
					label: 'Created'
				},
				{
					name: 'updated',
					label: 'Updated'	
				},
				
			],
			comment: [
				{
					name: 'author.name',
					label: 'User',
					color: chalk.cyan
				},
				{
					name: 'body',
					label: 'Comment',
					color: chalk.reset
				},
				{
					name: 'created',
					label: 'When',
					color: chalk.blue
				}
			]
		};
		
	function parse ( object, fields ) {
		var output;
		
		output = fields.map(function ( field ) {
			var val = format(object, '%(' + field.name + ')s');		
			return field.color(val);
		});
		
		return output;
	}
		
	function parseIssue ( issue ) {
		
		var fields = defaults.issue,
			line;
			
		line = parse(_.assign(_.clone(issue), issue.fields), fields);
		
		return line;
	}
	
	function parseIssueExpanded ( issue ) {
		
		var header = table([ parseIssue(issue) ], { flex: [ false, true ] }),
			obj = _.assign(_.clone(issue), issue.fields),
			rows,
			body,
			comments = [],
			width = 100;
						
		if(obj.comment) {
			comments = obj.comment.comments.map(function ( comment ) {
				return wrap(chalk.bold.green(comment.author.name + ' > ') + '  ' + comment.body, { width: width });
			}).join('\n');
		}
			
		rows = defaults.issueExpanded.map(function ( field ) {
			return [ chalk.bold(field.label), chalk.reset(format(obj, '%(' + field.name + ')s')) ];
		});
		
		body = table(rows, { flex: [ false, true] });
		
		return _.compact([ header, body, comments ]).join('\n\n');
	}
		
	return { 
		issue: function ( issues ) {
				
			var t = issues.map(parseIssue);
			
			console.log(table(t, { flex: [ false, true ]}));
			
		},
		issueExpanded: function ( issues ) {
			
			var tables = issues.map(parseIssueExpanded);
			
			console.log('\n' + tables.join('\n\n' + Array.apply(null, new Array(10)).join('=') + '\n\n'));
			
		}
	};
	
})();
