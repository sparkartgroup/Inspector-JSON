// Get the type of something as a string
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

var InspectorJSON = function( params ){
	
	'use strict';

	params = params || {};
	var defaults = {
		element: 'body',
		debug: false,
		collapsed: true,
		url: location.pathname
	};
	
	_( params ).defaults( defaults );
	
	var collapse_states = store.get( params.url +':inspectorJSON/collapse_states' ) || {};
	this.$el = $( params.element );
	this.$el.addClass('inspector-json viewer');
	
	// Delegate the click event for collapse/uncollapse of JSON levels
	this.$el.on( 'click.json', 'li.object > a, li.array > a', function( e ){
		
		e.preventDefault();
		
		var $this = $(this);
		var $parent = $this.parent();
		var path = $parent.data('path');
				
		$parent.toggleClass('collapsed');
		
		var expanded = !$parent.is('.collapsed');
		
		if( expanded )
			collapse_states[path] = expanded;
		else
			delete collapse_states[path];
		
		store.set( params.url +':inspectorJSON/collapse_states', collapse_states );
		
	});
	
	// Create the JSON Viewer on the specified element
	this.view = function( json ){
		
		if( params.debug ){
			var start = new Date().getTime();
		}
		
		var processString = function( string ){
			
			return unescape( string ).replace( /</g, '&lt;' ).replace( />/g, '&gt;' );
			
		};
		
		// Create markup from a value
		var processItem = function( item, parent, key, path ){
			
			var type = _.type( item );
			var parent_type = _.type( parent );
			var markup = '';
			
			// Create a string representation of the JSON path to this value
			path = path
				? ( parent_type === 'array' )
					? path +'['+ key +']'
					: path +'.'+ key
				: key;
			
			// Start the <li>
			if( parent ){
				markup += ( collapse_states[path] || !params.collapsed || ( type !== 'object' && type !== 'array' ) )
					? '<li class="'+ type +'" data-path="'+ path +'">'
					: '<li class="'+ type +' collapsed" data-path="'+ path +'">';
			}
			
			// Generate markup by value type. Recursion for arrays and objects.
			if( type === 'object' ){
				if( key )
					markup += '<a href="#toggle"><strong>'+ key + '</strong></a>';
				markup += '<ul>';
				for( key in item )
					markup += processItem( item[key], item, key, path );
				markup += '</ul>';
			}
			else if( type === 'array' ){
				if( key )
					markup += '<a href="#toggle"><strong>'+ key +'</strong></a>Array('+ item.length +')';
				markup += '<ol>';
				for( var i in item )
					markup += processItem( item[i], item, i, path );
				markup += '</ol>';
			}
			else if( type === 'string' )
				markup += '<strong>'+ key + '</strong><span>"'+ processString( item ) +'"</span>';
			else if( type === 'number' )
				markup += '<strong>'+ key + '</strong><var>'+ item.toString() +'</var>';
			else if( type === 'boolean' )
				markup += '<strong>'+ key + '</strong><em>'+ item.toString() + '</em>';
			else if( type === 'null' )
				markup += '<strong>'+ key + '</strong><i>null</i>';
			
			// End the </li>
			if( parent )
				markup += '</li>';
			
			return markup;
		
		};
		
		if( _( json ).isString() )
			json = JSON.parse( json );
		
		var root = processItem( json );
		var $root = $( root );
		
		this.$el.html( $root );
		
		if( params.debug ){
			var end = new Date().getTime();
			console.log('Rendered in '+ ( end - start ) +'ms');
		}
				
	};
	
	// LEAVE NO EVIDENCE!!!
	this.destroy = function(){
		
		this.$el
			.off('.json')
			.empty();
		
	};
	
};