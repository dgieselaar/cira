var sprintf = require('sprintf-js').sprintf;

module.exports = function ( object, format ) {
	
	return sprintf(format, object);
};
