_.mixin({
	
	type: function( item ){
		if( _.isElement( item ) )			return 'element';
		else if( _.isFunction( item ) )		return 'function';
		else if( _.isArray( item ) )		return 'array';
		else if( _.isArguments( item ) )	return 'arguments';
		else if( _.isString( item ) )		return 'string';
		else if( _.isNumber( item ) )		return 'number';
		else if( _.isBoolean( item ) )		return 'boolean';
		else if( _.isDate( item ) )			return 'date';
		else if( _.isRegExp( item ) )		return 'regexp';
		else if( _.isNull( item ) )			return 'null';
		else if( _.isUndefined( item ) )	return 'undefined';
		else if( _.isObject( item ) )		return 'object';
		else 								return 'unknown';
	}
	
});