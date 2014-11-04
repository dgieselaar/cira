/*global require, module*/

var chalk = require('chalk'),
	_ = require('lodash'),
	ansiRegex = require('ansi-regex')();

module.exports = function ( table, options ) {
	
	var opts = options || {},
		maxWidth = opts.width || 80,
		truncater = opts.truncater || '...',
		flex = opts.flex || {},
		spacing = opts.spacing || 2,
		output,
		cols,
		width,
		space,
		numFlex,
		maxCols,
		totalWidth;
		
	maxCols = Math.max.apply(null, _.pluck(table, 'length'));
	
	cols = Array.apply(null, new Array(maxCols)).map(function (  ) {
		
		var index = arguments[1],
			isFlexible = !!flex[index],
			width,
			colCells;
				
		if(isFlexible) {
			width = truncater.length;
		} else {
			colCells = _.pluck(table, index);
			width = Math.max.apply(null, _.map(colCells, function ( txt ) {
				var stripped = chalk.stripColor(txt || ''),
					max;
					
				max = Math.max.apply(null, _.pluck(stripped.split('\n'), 'length'));
				
				return max;
			}));
		}
		
		return {
			preferredWidth: width,
			flex: isFlexible
		};
		
	});
	
 	width = maxWidth - ((cols.length + 1) * spacing);
 	
 	totalWidth = cols.reduce(function ( sum, col ) {
 		return sum + col.preferredWidth;
 	}, 0);
 	
 	space = width - cols.reduce(function ( sum, col ) {
 		return col.preferredWidth + sum;
 	}, 0);
 	
 	numFlex = cols.reduce(function ( sum, col ) {
 		return col.flex ? sum + 1 : sum;
 	}, 0);
 	
 	cols.forEach(function ( col ) {
 		
 		var colWidth,
 			share,
 			shrink;
 		
 		if(space > 0) {
 			if(col.flex) {
 				colWidth = space/numFlex;
 			} else {
 				colWidth = col.preferredWidth;
 			}
 		} else {
 			share = col.preferredWidth/totalWidth;
 			shrink = share * -space;
 			colWidth = Math.max(truncater.length, Math.floor(col.preferredWidth - shrink));
 		}
 		
 		col.colWidth = colWidth;
 		
 	});
 	
 	output = table.map(function ( row ) {
 		
 		var line = row.map(function ( cell, colIndex ) {
 			
 			var col = cols[colIndex],
 				width = col.colWidth,
 				txt = cell || '',
 				stripped = chalk.stripColor(txt),
 				len = stripped.length,
 				pad = width - len,
 				output,
 				colors;
				
			if(pad > 0) {
				output = cell + Array.apply(null, new Array(pad+1)).join(' ');
			} else if(pad < 0) {
				colors = txt.match(ansiRegex);
				output = stripped.substr(0, width - truncater.length) + truncater;
				if(colors) {
					output = colors[0] + output + colors[1];
				}
			} else {
				output = txt;
			}
			
			return output;
 		});
 		
 		return line.join(Array.apply(null, Array(spacing+1)).join(' ').toString());
 	}).join('\r\n');
 	
 	return output;
	
};
